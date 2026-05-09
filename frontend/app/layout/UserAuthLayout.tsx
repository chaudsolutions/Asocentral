import { useEffect } from "react";
import { Outlet } from "react-router";
import { useNavigate } from "react-router";
import PageLoader from "~/components/animations/PageLoader";
import { useAuthContext } from "~/context/AuthContext";

export default function AuthWrapper() {
    const navigate = useNavigate();
    const { userToken, isCheckingAuth } = useAuthContext();

    useEffect(() => {
        if (userToken) {
            navigate("/user/dashboard");
        }
    }, [userToken, navigate]);

    if (isCheckingAuth) {
        return <PageLoader />;
    }

    return <Outlet />;
}
