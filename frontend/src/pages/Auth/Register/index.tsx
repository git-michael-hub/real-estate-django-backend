import { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import useAuth from "../../../features/auth/hooks/useAuth";
import RegisterForm from "../../../features/auth/components/RegisterForm";
import "./index.css";

export default function Register() {
    const navigate: NavigateFunction = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) navigate("/");
    }, []);

    return (
        <main id="register-page">
            <h1>Register Page</h1>
            <RegisterForm></RegisterForm>
        </main>
    );
}
