export interface ToastState {
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
}
