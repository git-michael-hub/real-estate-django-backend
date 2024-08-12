import { useEffect } from "react";
import { NavigateFunction, useNavigate, Link } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useAuth";
import LoginForm from "../../features/auth/components/LoginForm";

export default function Login() {
    const navigate: NavigateFunction = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) navigate("/");
    }, []);

    return (
        <main id="login-page">
            <h1>Login Page</h1>
            <LoginForm></LoginForm>
            <Link to={"/register"}>Register</Link>
        </main>
    );
}
