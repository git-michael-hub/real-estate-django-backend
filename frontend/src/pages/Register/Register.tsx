import { useEffect } from "react";
import { NavigateFunction, useNavigate, Link } from "react-router-dom";
import useUser from "../../features/auth/hooks/useUser";
import { UserType } from "../../features/auth/context/UserProvider";
import RegisterForm from "../../features/auth/components/RegisterForm";

export default function Register() {
    const navigate: NavigateFunction = useNavigate();
    const { fetchUser } = useUser();

    useEffect(() => {
        fetchUser().then((response: UserType | null) => (response ? navigate("/") : {}));
    }, []);

    return (
        <main id="register-page">
            <RegisterForm></RegisterForm>
            <Link to={"/login"}>Login</Link>
        </main>
    );
}
