import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../../features/auth/hooks/useAuth";
import ListDropDown from "../List/ListDropDown";
import { AuthFormMessageType } from "../../types/formMessages";
import BtnIconRound from "../Buttons/BtnIconRound";

import "./index.css";
import DefaultModal from "../Modal/DefaultModal";
import useBuyer from "../../features/buyers/hooks/useBuyers";
import useAgent from "../../features/agents/hooks/useAgents";
import useSeller from "../../features/sellers/hooks/useSellers";

export default function Navbar() {
    const [isUserMenuDropdownVisible, setIsUserMenuDropdownVisible] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isNavDropdownVisible, setIsNavDropdownVisible] = useState<boolean>(false);
    const { user, setAuthRole, authRole } = useAuth();
    const { buyer, fetchBuyerAndUpdateState } = useBuyer();
    const { seller, fetchSellerAndUpdateState } = useSeller();
    const { agent, fetchAgentAndUpdateState } = useAgent();

    useEffect(() => {
        const init = async () => {
            if (user) {
                await fetchBuyerAndUpdateState(user.username);
                await fetchSellerAndUpdateState(user.username);
                await fetchAgentAndUpdateState(user.username);
            }
        };

        init();
    }, []);

    function onClickNavUsername(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setIsUserMenuDropdownVisible(!isUserMenuDropdownVisible);
        setIsNavDropdownVisible(false);
    }

    function onClickNavMenu(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setIsNavDropdownVisible(!isNavDropdownVisible);
        setIsUserMenuDropdownVisible(false);
    }

    return (
        <header id="navbar">
            <div>
                <h1 className="brand">
                    RES<span>ystem</span>
                </h1>
                <nav>
                    <Link to={"/"} className="navbar-item">
                        Home
                    </Link>
                    <Link to={"/about"} className="navbar-item">
                        About Us
                    </Link>
                    <Link to={"/listings/?page=1"} className="navbar-item">
                        Listings
                    </Link>
                    <Link to={"/agents"} className="navbar-item">
                        Find Agent
                    </Link>
                    {user ? (
                        <span>
                            <BtnIconRound onClick={onClickNavUsername}>
                                <i className="fa-solid fa-user"></i>
                            </BtnIconRound>
                            {isUserMenuDropdownVisible ? (
                                <UserMenuDropdown
                                    setIsUserMenuDropdownVisible={setIsUserMenuDropdownVisible}
                                    setIsModalVisible={setIsModalVisible}
                                />
                            ) : (
                                <></>
                            )}
                        </span>
                    ) : (
                        <Link to={"/login"} className="navbar-item">
                            Login
                        </Link>
                    )}
                </nav>
                <nav className="nav-menu">
                    {user ? (
                        <span>
                            <BtnIconRound onClick={onClickNavUsername}>
                                <i className="fa-solid fa-user"></i>
                            </BtnIconRound>
                            {isUserMenuDropdownVisible ? (
                                <UserMenuDropdown
                                    setIsUserMenuDropdownVisible={setIsUserMenuDropdownVisible}
                                    setIsModalVisible={setIsModalVisible}
                                />
                            ) : (
                                <></>
                            )}
                        </span>
                    ) : (
                        <Link to={"/login"} className="navbar-item">
                            Login
                        </Link>
                    )}
                    <span>
                        <BtnIconRound onClick={onClickNavMenu}>
                            <i className="fa-solid fa-bars"></i>
                        </BtnIconRound>
                        {isNavDropdownVisible ? (
                            <NavDropdown setIsNavDropdownVisible={setIsNavDropdownVisible} />
                        ) : (
                            <></>
                        )}
                    </span>
                </nav>
            </div>
            <DefaultModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}>
                <div onClick={() => setAuthRole("buyer")}>
                    {buyer?.profile_image_path ? (
                        <img src={buyer?.profile_image_path.toString()} alt="" className="profile-image-round" />
                    ) : (
                        <img src="/static/images/default-profile-picture.jpg" alt="" className="profile-image-round" />
                    )}
                    <div>
                        <strong>
                            {buyer?.user.first_name} {buyer?.user.last_name}
                        </strong>
                        {authRole === "buyer" ? <span>Active</span> : <></>}
                    </div>
                </div>
                {seller ? (
                    <div onClick={() => setAuthRole("seller")}>
                        {seller.profile_image_path ? (
                            <img src={seller?.profile_image_path.toString()} alt="" className="profile-image-round" />
                        ) : (
                            <img
                                src="/static/images/default-profile-picture.jpg"
                                alt=""
                                className="profile-image-round"
                            />
                        )}
                        <div>
                            <strong>{seller?.business_name}</strong>
                            {authRole === "seller" ? <span>Active</span> : <></>}
                        </div>
                    </div>
                ) : (
                    <></>
                )}

                {agent ? (
                    <div onClick={() => setAuthRole("agent")}>
                        {agent.profile_image_path ? (
                            <img src={agent?.profile_image_path.toString()} alt="" className="profile-image-round" />
                        ) : (
                            <img
                                src="/static/images/default-profile-picture.jpg"
                                alt=""
                                className="profile-image-round"
                            />
                        )}
                        <div>
                            <strong>{agent?.agent_name}</strong>
                            {authRole === "agent" ? <span>Active</span> : <></>}
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </DefaultModal>
        </header>
    );
}

type UserMenuDropdownType = {
    setIsUserMenuDropdownVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

function UserMenuDropdown({ setIsUserMenuDropdownVisible, setIsModalVisible }: UserMenuDropdownType) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    async function onClickLogout(): Promise<void> {
        const messages: AuthFormMessageType = await logout();
        if (messages.success) navigate("/login");
        console.log(messages);
    }

    function onClickSwitchProfile(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        setIsModalVisible(true);
    }

    return (
        <>
            <ListDropDown onClick={() => setIsUserMenuDropdownVisible(false)}>
                <li>
                    <Link to={`/user/${user?.username}`}>@{user?.username}</Link>
                </li>
                <li>
                    <Link to={"/my-real-estate/dashboard"}>Dashboard</Link>
                </li>
                <li>
                    <Link to="/" onClick={onClickSwitchProfile}>
                        Switch Profile
                    </Link>
                </li>
                <li>
                    <button type="button" onClick={onClickLogout}>
                        Logout
                    </button>
                </li>
            </ListDropDown>
        </>
    );
}

type NavDropdownType = {
    setIsNavDropdownVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

function NavDropdown({ setIsNavDropdownVisible }: NavDropdownType) {
    return (
        <ListDropDown onClick={() => setIsNavDropdownVisible(false)}>
            <li>
                <Link to={"/"}>Home</Link>
            </li>
            <li>
                <Link to={"/about"}>About Us</Link>
            </li>
            <li>
                <Link to={"/listings/?page=1"}>Listings</Link>
            </li>
            <li>
                <Link to={"/agents"}>Find Agent</Link>
            </li>
        </ListDropDown>
    );
}
