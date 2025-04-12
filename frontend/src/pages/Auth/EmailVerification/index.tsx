import { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import useAuth from "../../../features/auth/hooks/useAuth";
import EmailVerificationForm from "../components/EmailVerificationForm";
import "./index.css";

export default function EmailVerification() {
    const navigate: NavigateFunction = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) navigate("/");
    }, []);

    return (
        <main id="email-verification-page">
            <EmailVerificationForm></EmailVerificationForm>
        </main>
    );
}
