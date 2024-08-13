import { useEffect } from "react";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import ForgotPasswordForm from "../../../features/auth/components/ForgotPasswordForm";
import useAuth from "../../../features/auth/hooks/useAuth";

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
                <div>
                    <Link to={"/login"}>Back to Sign In</Link>
                </div>
            </main>
        </>
    );
}
