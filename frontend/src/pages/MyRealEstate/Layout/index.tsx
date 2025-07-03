import { Link, Outlet } from "react-router-dom";
import "./index.css";
import useAuth from "../../../features/auth/hooks/useAuth";

const DEFAULT_PROFILE_PICTURE = "/static/images/default-profile-picture.jpg";

export default function Layout() {
    const { user } = useAuth();

    return (
        <div id="my-real-estate-layout">
            <nav className="nav-panel">
                <figure>
                    <img
                        src={DEFAULT_PROFILE_PICTURE}
                        alt="Photo by Muhammad Khaleeq on https://www.vecteezy.com/vector-art/288638-broker-vector-icon"
                        id="profile-image"
                    />
                    <div>
                        <em>@{user?.username}</em>
                    </div>
                </figure>
                <div className="nav-list">
                    <Link to={"/my-real-estate/dashboard"}>
                        <i className="fa-solid fa-cube"></i> Dashboard
                    </Link>
                    <Link to={"/my-real-estate/properties"}>
                        <i className="fa-solid fa-house"></i> Properties
                    </Link>
                    <Link to={"/my-real-estate/listings"}>
                        <i className="fa-solid fa-table-list"></i> Listings
                    </Link>
                    <Link to={"/my-real-estate/agents"}>
                        <i className="fa-solid fa-users"></i> Agents
                    </Link>
                </div>
            </nav>
            <Outlet></Outlet>
        </div>
    );
}
