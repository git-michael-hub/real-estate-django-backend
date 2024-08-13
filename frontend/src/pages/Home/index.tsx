import { Link } from "react-router-dom";

import "./index.css";
import useAuth from "../../features/auth/hooks/useAuth";

export default function Home() {
    const { user, logout } = useAuth();

    async function onSubmitLogout(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        e.stopPropagation();
        const formData: FormData = new FormData(e.currentTarget);
        await logout(formData);
    }

    return (
        <main id="home-page">
            {!!user ? (
                <>
                    <h1>Welcome @{user.username}</h1>
                    <form onClick={onSubmitLogout}>
                        <button>Logout</button>
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
