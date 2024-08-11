import { Link } from "react-router-dom";
import useUser from "../../features/auth/hooks/useUser";
import "./index.css";

export default function Home() {
    const { user } = useUser();

    return (
        <main>
            {!!user.username ? (
                <>
                    <h1>Welcome @{user.username}</h1>
                    <button>Logout</button>
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
