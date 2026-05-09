import { createContext, useContext, useEffect, useState } from "react";
import {
    adminLocalStorageToken,
    localStorageToken,
} from "../utils/constants";
import { getAdminToken, getUserToken } from "~/hooks/useTools";

type AuthRole = "admin" | "user";

interface AuthContext {
    adminToken: string | null;
    userToken: string | null;
    login: (token: string, role: AuthRole) => void;
    logout: (role?: AuthRole) => void;
    isCheckingAuth: boolean;
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

    useEffect(() => {
        setIsMounted(true);
        setIsCheckingAuth(true);

        // Only access localStorage after component mounts
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

    return (
        <AuthContext.Provider
            value={{ adminToken, userToken, login, logout, isCheckingAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw Error(
            "useAuth Context must be used inside an AuthContextProvider",
        );
    }

    return context;
};
