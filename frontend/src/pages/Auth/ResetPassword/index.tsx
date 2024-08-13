import { useEffect } from "react";
import { Link, useNavigate, NavigateFunction } from "react-router-dom";
import useAuth from "../../../features/auth/hooks/useAuth";
import ResetPasswordForm from "../../../features/auth/components/ResetPasswordForm";

export default function ResetPassword() {
    const navigate: NavigateFunction = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) navigate("/");
    }, []);

    return (
        <main id="reset-password-page">
            <ResetPasswordForm></ResetPasswordForm>
            <Link to={"/login"}>Back to Sign In</Link>
        </main>
    );
}
