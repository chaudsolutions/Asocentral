import { createContext, useContext, useEffect, useState } from "react";
import { localStorageToken } from "../utils/constants";
import { getUserToken } from "~/hooks/useTools";

interface AuthContext {
    user: string | null;
    login: (user: string) => void;
    logout: () => void;
    isCheckingAuth: boolean;
}

export const AuthContext = createContext<AuthContext>({} as AuthContext);

export const AuthContextProvider = ({
    children,
    initialUser = null,
}: {
    children: React.ReactNode;
    initialUser?: AuthContext["user"];
}) => {
    const [user, setUser] = useState<AuthContext["user"]>(initialUser);
    const [isMounted, setIsMounted] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        setIsCheckingAuth(true);

        // Only access localStorage after component mounts
        const { token } = getUserToken();
        if (token) setUser(token);

        setIsCheckingAuth(false);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        if (user) {
            localStorage.setItem(localStorageToken, JSON.stringify(user));
        } else {
            localStorage.removeItem(localStorageToken);
        }
    }, [user, isMounted]);

    // Function to log in a user
    const login = (userData: string) => {
        setUser(userData);

        localStorage.setItem(localStorageToken, JSON.stringify(userData));
    };

    // Function to log out a user
    const logout = () => {
        setUser(null);
        // Clear user data from local storage

        localStorage.removeItem(localStorageToken);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isCheckingAuth }}>
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
