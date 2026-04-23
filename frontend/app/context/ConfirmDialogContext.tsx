import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    type ReactNode,
} from "react";
import ConfirmActionDialog from "~/components/custom/dialogs/ConfirmActionDialog";

interface ConfirmDialogOptions {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: "primary" | "secondary" | "error" | "success" | "warning";
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
}

interface ConfirmDialogState extends ConfirmDialogOptions {
    open: boolean;
    loading: boolean;
    resolvePromise?: (value: boolean) => void;
}

interface ConfirmDialogContextType {
    confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
    closeDialog: () => void;
    setLoading: (loading: boolean) => void;
}

const ConfirmDialogContext = createContext<
    ConfirmDialogContextType | undefined
>(undefined);

export const ConfirmDialogProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [dialog, setDialog] = useState<ConfirmDialogState>({
        open: false,
        message: "",
        loading: false,
    });

    const closeDialog = useCallback(() => {
        setDialog((prev) => ({
            ...prev,
            open: false,
            loading: false,
            resolvePromise: undefined,
        }));
    }, []);

    const setLoading = useCallback((loading: boolean) => {
        setDialog((prev) => ({ ...prev, loading }));
    }, []);

    const confirm = useCallback(
        (options: ConfirmDialogOptions): Promise<boolean> => {
            return new Promise((resolve) => {
                setDialog({
                    open: true,
                    message: options.message,
                    title: options.title,
                    confirmText: options.confirmText || "Confirm",
                    cancelText: options.cancelText || "Cancel",
                    confirmColor: options.confirmColor || "primary",
                    onConfirm: options.onConfirm,
                    onCancel: options.onCancel,
                    loading: false,
                    resolvePromise: resolve, // Store the resolve function
                });
            });
        },
        [],
    );

    const handleConfirm = async () => {
        setDialog((prev) => ({ ...prev, loading: true }));

        try {
            if (dialog.onConfirm) {
                await dialog.onConfirm();
            }

            // Resolve with true
            if (dialog.resolvePromise) {
                dialog.resolvePromise(true);
            }

            closeDialog();
        } catch (error) {
            setDialog((prev) => ({ ...prev, loading: false }));
            throw error;
        }
    };

    const handleCancel = () => {
        if (dialog.onCancel) {
            dialog.onCancel();
        }

        // Resolve with false
        if (dialog.resolvePromise) {
            dialog.resolvePromise(false);
        }

        closeDialog();
    };

    return (
        <ConfirmDialogContext.Provider
            value={{ confirm, closeDialog, setLoading }}>
            {children}
            <ConfirmActionDialog
                open={dialog.open}
                onClose={handleCancel}
                onConfirm={handleConfirm}
                title={dialog.title}
                message={dialog.message}
                confirmText={dialog.confirmText}
                cancelText={dialog.cancelText}
                confirmColor={dialog.confirmColor}
                loading={dialog.loading}
            />
        </ConfirmDialogContext.Provider>
    );
};

export const useConfirmDialog = (): ConfirmDialogContextType => {
    const context = useContext(ConfirmDialogContext);
    if (context === undefined) {
        throw new Error(
            "useConfirmDialog must be used within a ConfirmDialogProvider",
        );
    }
    return context;
};
