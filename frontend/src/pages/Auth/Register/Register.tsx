import { useEffect } from "react";
import { NavigateFunction, useNavigate, Link } from "react-router-dom";
import useAuth from "../../../features/auth/hooks/useAuth";
import RegisterForm from "../../../features/auth/components/RegisterForm";

export default function Register() {
    const navigate: NavigateFunction = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) navigate("/");
    }, []);

    return (
        <main id="register-page">
            <RegisterForm></RegisterForm>
            <Link to={"/login"}>Login</Link>
        </main>
    );
}
