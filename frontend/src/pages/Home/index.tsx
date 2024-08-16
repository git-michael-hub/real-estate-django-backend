import { Link, useNavigate } from "react-router-dom";

import "./index.css";
import useAuth from "../../features/auth/hooks/useAuth";
import { FormMessageStateType } from "../../features/auth/context/AuthProvider";
import BtnBasic from "../../components/Buttons/BtnBasic";

export default function Home() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    async function onSubmitLogout(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        e.stopPropagation();
        const formData: FormData = new FormData(e.currentTarget);
        const messages: FormMessageStateType = await logout(formData);
        if (messages.success) navigate("/login");
        console.log(messages);
    }

    return (
        <main id="home-page">
            {!!user ? (
                <>
                    <h1>Welcome @{user.username}</h1>
                    <div>
                        <Link to={"/buyer"}>Go to Buyer Page</Link>
                        <Link to={"/seller"}>Go to Seller Page</Link>
                        <Link to={"/agent"}>Go to Agent Page</Link>
                    </div>
                    <form onClick={onSubmitLogout}>
                        <BtnBasic>
                            <span>Logout</span>
                        </BtnBasic>
                    </form>
                </>
            ) : (
                <>
                    <h1>Home Page</h1>
                    <Link to={"/login"}>Login</Link>
                </>
            )}
        </main>
    );
}
