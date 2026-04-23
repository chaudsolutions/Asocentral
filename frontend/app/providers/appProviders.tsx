import { QueryProvider } from "./useQueryProvider";
import CustomThemeProvider from "./CustomThemeProvider";
import { AuthContextProvider } from "~/context/AuthContext";
import { ToastProvider } from "~/context/ToastContext";
import { ConfirmDialogProvider } from "~/context/ConfirmDialogContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            <CustomThemeProvider>
                <AuthContextProvider>
                    <ConfirmDialogProvider>
                        <ToastProvider>{children}</ToastProvider>
                    </ConfirmDialogProvider>
                </AuthContextProvider>
            </CustomThemeProvider>
        </QueryProvider>
    );
}
