import { Link, Outlet, useNavigate } from "react-router-dom";
import { C_AUTH } from "../../../constants/auth";
import useAuth from "../../../features/auth/hooks/useAuth";
import useSeller from "../../../features/sellers/hooks/useSellers";
import useBuyer from "../../../features/buyers/hooks/useBuyers";
import useAgent from "../../../features/agents/hooks/useAgents";
import "./index.css";
import { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner";

export default function Layout() {
    const [isReady, setIsReady] = useState<boolean>(false);
    const navigate = useNavigate();
    const { user, authRole } = useAuth();
    const { buyer, fetchBuyerAndUpdateState } = useBuyer();
    const { seller, fetchSellerAndUpdateState } = useSeller();
    const { agent, fetchAgentAndUpdateState } = useAgent();

    useEffect(() => {
        const init = async () => {
            if (!user) return;
            if (authRole === C_AUTH.ACCOUNT_ROLE.BUYER) navigate("my-real-estate/accounts");
            await fetchBuyerAndUpdateState(user.username);
            await fetchSellerAndUpdateState(user.username);
            await fetchAgentAndUpdateState(user.username);
            setIsReady(true);
        };

        init();
    }, []);

    function getProfilePicture(): string {
        let profile_picture: string | undefined;
        if (authRole === C_AUTH.ACCOUNT_ROLE.BUYER) profile_picture = buyer?.profile_image_path;
        if (authRole === C_AUTH.ACCOUNT_ROLE.SELLER) profile_picture = seller?.profile_image_path;
        if (authRole === C_AUTH.ACCOUNT_ROLE.AGENT) profile_picture = agent?.profile_image_path;
        if (profile_picture) return profile_picture;
        return C_AUTH.DEFAULT.PROFILE_IMAGE;
    }

    return (
        <div id="my-real-estate-layout">
            <nav className="nav-panel">
                {isReady ? (
                    <>
                        <figure>
                            <img
                                src={getProfilePicture()}
                                alt="Photo by Muhammad Khaleeq on https://www.vecteezy.com/vector-art/288638-broker-vector-icon"
                                id="profile-image"
                            />
                            <div>
                                {authRole === C_AUTH.ACCOUNT_ROLE.BUYER ? (
                                    <strong>
                                        {buyer?.user.first_name} {buyer?.user.last_name}
                                    </strong>
                                ) : authRole === C_AUTH.ACCOUNT_ROLE.SELLER ? (
                                    <strong>{seller?.business_name}</strong>
                                ) : authRole === C_AUTH.ACCOUNT_ROLE.AGENT ? (
                                    <strong>{agent?.agent_name}</strong>
                                ) : (
                                    <></>
                                )}
                                <em>@{user?.username}</em>
                            </div>
                        </figure>
                        <div className="nav-list">
                            {authRole === C_AUTH.ACCOUNT_ROLE.BUYER ? (
                                <></>
                            ) : (
                                <>
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
                                    <Link to={"/my-real-estate/accounts"}>
                                        <i className="fa-solid fa-user"></i> Accounts
                                    </Link>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <Spinner></Spinner>
                )}
            </nav>
            <Outlet></Outlet>
        </div>
    );
}
