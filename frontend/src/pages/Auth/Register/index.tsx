import { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import useAuth from "../../../features/auth/hooks/useAuth";
import RegisterForm from "../components/RegisterForm";
import "./index.css";

export default function Register() {
    const navigate: NavigateFunction = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) navigate("/");
    }, []);

    return (
        <main id="register-page">
            <RegisterForm></RegisterForm>
        </main>
    );
}
