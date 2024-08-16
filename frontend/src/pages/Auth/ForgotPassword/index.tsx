import { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import ForgotPasswordForm from "../../../features/auth/components/ForgotPasswordForm";
import useAuth from "../../../features/auth/hooks/useAuth";
import "./index.css";

export default function ForgotPassword() {
    const navigate: NavigateFunction = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) navigate("/");
    }, []);

    return (
        <>
            <main id="forgot-password-page">
                <h1>Forgot Password Page</h1>
                <ForgotPasswordForm></ForgotPasswordForm>
            </main>
        </>
    );
}
