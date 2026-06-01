import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    adminLocalStorageToken,
    localStorageToken,
} from "../utils/constants";
import { getAdminToken, getUserToken } from "~/hooks/useTools";
import SessionExpiredDialog from "~/components/SessionExpiredDialog";

type AuthRole = "admin" | "user";

interface AuthContext {
    adminToken: string | null;
    userToken: string | null;
    login: (token: string, role: AuthRole) => void;
    logout: (role?: AuthRole) => void;
    isCheckingAuth: boolean;
    sessionExpired: boolean;
    expiredRole: AuthRole | null;
    clearSessionExpired: () => void;
}

export const AuthContext = createContext<AuthContext>({} as AuthContext);

export const AuthContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [adminToken, setAdminToken] = useState<string | null>(null);
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [expiredRole, setExpiredRole] = useState<AuthRole | null>(null);

    useEffect(() => {
        setIsMounted(true);
        setIsCheckingAuth(true);

        const { token: storedAdminToken } = getAdminToken();
        const { token: storedUserToken } = getUserToken();
        if (storedAdminToken) setAdminToken(storedAdminToken);
        if (storedUserToken) setUserToken(storedUserToken);

        setIsCheckingAuth(false);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        if (adminToken) {
            localStorage.setItem(
                adminLocalStorageToken,
                JSON.stringify(adminToken),
            );
        } else {
            localStorage.removeItem(adminLocalStorageToken);
        }

        if (userToken) {
            localStorage.setItem(localStorageToken, JSON.stringify(userToken));
        } else {
            localStorage.removeItem(localStorageToken);
        }
    }, [adminToken, userToken, isMounted]);

    // Global 401 interceptor — shows session expired dialog instead of leaving
    // the user stuck in a redirect loop with a stale token.
    useEffect(() => {
        const id = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                const url: string = error.config?.url ?? "";

                // Auth endpoints return 401 for wrong credentials — don't treat
                // those as session expiry.
                if (url.includes("/auth/")) return Promise.reject(error);

                if (error.response?.status === 401) {
                    const hasAdminToken = !!getAdminToken().token;
                    const hasUserToken = !!getUserToken().token;

                    // Only trigger if the user actually had a stored token
                    // (meaning a session was active and has now expired).
                    if (hasAdminToken || hasUserToken) {
                        const role: AuthRole = url.includes("/admin/")
                            ? "admin"
                            : "user";
                        setExpiredRole(role);
                        setSessionExpired(true);
                    }
                }

                return Promise.reject(error);
            },
        );
        return () => axios.interceptors.response.eject(id);
    }, []);

    const login = (token: string, role: AuthRole) => {
        if (role === "admin") {
            setAdminToken(token);
            localStorage.setItem(
                adminLocalStorageToken,
                JSON.stringify(token),
            );
            return;
        }
        setUserToken(token);
        localStorage.setItem(localStorageToken, JSON.stringify(token));
    };

    const logout = (role?: AuthRole) => {
        if (role === "admin") {
            setAdminToken(null);
            localStorage.removeItem(adminLocalStorageToken);
            return;
        }
        if (role === "user") {
            setUserToken(null);
            localStorage.removeItem(localStorageToken);
            return;
        }
        setAdminToken(null);
        setUserToken(null);
        localStorage.removeItem(adminLocalStorageToken);
        localStorage.removeItem(localStorageToken);
    };

    const clearSessionExpired = () => {
        setSessionExpired(false);
        setExpiredRole(null);
    };

    return (
        <AuthContext.Provider
            value={{
                adminToken,
                userToken,
                login,
                logout,
                isCheckingAuth,
                sessionExpired,
                expiredRole,
                clearSessionExpired,
            }}>
            {children}
            <SessionExpiredListener />
        </AuthContext.Provider>
    );
};

// Separate inner component so useNavigate is called inside the router context.
function SessionExpiredListener() {
    const { sessionExpired, expiredRole, logout, clearSessionExpired } =
        useAuthContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        clearSessionExpired();
        navigate("/");
    };

    const handleRefresh = () => {
        if (expiredRole) logout(expiredRole);
        clearSessionExpired();
        navigate(expiredRole === "admin" ? "/auth/admin" : "/auth/user");
    };

    return (
        <SessionExpiredDialog
            open={sessionExpired}
            onLogout={handleLogout}
            onRefresh={handleRefresh}
        />
    );
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw Error(
            "useAuth Context must be used inside an AuthContextProvider",
        );
    }

    return context;
};
