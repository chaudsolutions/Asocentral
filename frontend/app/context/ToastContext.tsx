import React, {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";
import ToastNotification from "~/components/custom/notification/ToastNotification";
import type { ToastState } from "~/types/others";

interface ToastContextType {
    showToast: (
        message: string,
        severity?: "success" | "error" | "warning" | "info",
    ) => void;
    hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [toast, setToast] = useState<ToastState>({
        open: false,
        message: "",
        severity: "success",
    });

    const showToast = (
        message: string,
        severity: "success" | "error" | "warning" | "info" = "success",
    ) => {
        setToast({
            open: true,
            message,
            severity,
        });
    };

    const hideToast = () => {
        setToast((prev) => ({ ...prev, open: false }));
    };

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <ToastNotification
                open={toast.open}
                onClose={hideToast}
                severity={toast.severity}
                message={toast.message}
            />
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
