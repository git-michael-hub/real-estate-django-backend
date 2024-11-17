import { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import useAuth from "../../../features/auth/hooks/useAuth";
import LoginForm from "../components/LoginForm";
import "./index.css";

export default function Login() {
    const navigate: NavigateFunction = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) navigate("/");
    }, []);

    return (
        <main id="login-page">
            <LoginForm></LoginForm>
        </main>
    );
}
