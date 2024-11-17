import { useEffect } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import useAuth from "../../../features/auth/hooks/useAuth";
import ResetPasswordForm from "../components/ResetPasswordForm";
import "./index.css";

export default function ResetPassword() {
    const navigate: NavigateFunction = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) navigate("/");
    }, []);

    return (
        <main id="reset-password-page">
            <h1>Reset Password Page</h1>
            <ResetPasswordForm></ResetPasswordForm>
        </main>
    );
}
