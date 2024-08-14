import { useEffect } from "react";
import { NavigateFunction, useNavigate, Link } from "react-router-dom";
import useAuth from "../../../features/auth/hooks/useAuth";
import VerifyEmailForm from "../../../features/auth/components/VerifyEmailForm";

export default function VerifyEmail() {
    const navigate: NavigateFunction = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) navigate("/");
    }, []);

    return (
        <main id="verify-email-page">
            <VerifyEmailForm></VerifyEmailForm>
            <Link to={"/login"}>Login</Link>
        </main>
    );
}
