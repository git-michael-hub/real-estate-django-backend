import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../../features/auth/hooks/useAuth";
import useBuyer from "../../features/buyers/hooks/useBuyers";
import useAgent from "../../features/agents/hooks/useAgents";
import useSeller from "../../features/sellers/hooks/useSellers";
import BtnIconRound from "../Buttons/BtnIconRound";
import SwitchAccountModal from "./components/SwitchAccountModal";
import UserMenuDropdown from "./components/UserMenuDropdown";
import NavDropdown from "./components/NavDropDown";
import "./index.css";

export default function Navbar() {
    const [isUserMenuDropdownVisible, setIsUserMenuDropdownVisible] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isNavDropdownVisible, setIsNavDropdownVisible] = useState<boolean>(false);
    const { user } = useAuth();
    const { fetchBuyerAndUpdateState } = useBuyer();
    const { fetchSellerAndUpdateState } = useSeller();
    const { fetchAgentAndUpdateState } = useAgent();

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
            <SwitchAccountModal
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
            ></SwitchAccountModal>
        </header>
    );
}
