import { useEffect } from "react";
import { Outlet } from "react-router";
import { useNavigate } from "react-router";
import PageLoader from "~/components/animations/PageLoader";
import { useAuthContext } from "~/context/AuthContext";

export default function AdminAuthLayout() {
    const navigate = useNavigate();
    const { user, isCheckingAuth } = useAuthContext();

    useEffect(() => {
        if (user) {
            navigate("/admin/dashboard");
        }
    }, [user, navigate]);

    if (isCheckingAuth) {
        return <PageLoader />;
    }

    return <Outlet />;
}
