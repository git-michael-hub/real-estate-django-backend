import { Link, Outlet } from "react-router-dom";
import { C_AUTH } from "../../../constants/auth";
import useAuth from "../../../features/auth/hooks/useAuth";
import useSeller from "../../../features/sellers/hooks/useSellers";
import useBuyer from "../../../features/buyers/hooks/useBuyers";
import useAgent from "../../../features/agents/hooks/useAgents";
import "./index.css";

const DEFAULT_PROFILE_PICTURE = "/static/images/default-profile-picture.jpg";

export default function Layout() {
    const { user, getAuthRole } = useAuth();
    const { buyer } = useBuyer();
    const { seller } = useSeller();
    const { agent } = useAgent();

    function getProfilePicture(): string {
        let profile_picture: string | undefined;
        if (getAuthRole() === C_AUTH.ACCOUNT_ROLE.BUYER) profile_picture = buyer?.profile_image_path;
        if (getAuthRole() === C_AUTH.ACCOUNT_ROLE.SELLER) profile_picture = seller?.profile_image_path;
        if (getAuthRole() === C_AUTH.ACCOUNT_ROLE.AGENT) profile_picture = agent?.profile_image_path;
        if (profile_picture) return profile_picture;
        return DEFAULT_PROFILE_PICTURE;
    }

    return (
        <div id="my-real-estate-layout">
            <nav className="nav-panel">
                <figure>
                    <img
                        src={getProfilePicture()}
                        alt="Photo by Muhammad Khaleeq on https://www.vecteezy.com/vector-art/288638-broker-vector-icon"
                        id="profile-image"
                    />
                    <div>
                        {getAuthRole() === C_AUTH.ACCOUNT_ROLE.BUYER ? (
                            <strong>
                                {buyer?.user.first_name} {buyer?.user.last_name}
                            </strong>
                        ) : getAuthRole() === C_AUTH.ACCOUNT_ROLE.SELLER ? (
                            <strong>{seller?.business_name}</strong>
                        ) : getAuthRole() === C_AUTH.ACCOUNT_ROLE.AGENT ? (
                            <strong>{agent?.agent_name}</strong>
                        ) : (
                            <></>
                        )}
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
