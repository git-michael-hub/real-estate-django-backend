import { useEffect } from "react";
import { NavigateFunction, useNavigate, Link } from "react-router-dom";
import useUser from "../../features/auth/hooks/useUser";
import LoginForm from "../../features/auth/components/LoginForm";
import { UserType } from "../../features/auth/context/UserProvider";

export default function Login() {
    const navigate: NavigateFunction = useNavigate();
    const { fetchUser } = useUser();

    useEffect(() => {
        fetchUser().then((response: UserType | null) => (response ? navigate("/") : {}));
    }, []);

    return (
        <main id="login-page">
            <h1>Login Page</h1>
            <LoginForm></LoginForm>
            <Link to={"/register"}>Register</Link>
        </main>
    );
}
