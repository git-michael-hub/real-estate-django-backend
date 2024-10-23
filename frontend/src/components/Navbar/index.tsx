import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../../features/auth/hooks/useAuth";
import ListDropDown from "../List/ListDropDown";
import { FormMessageStateType } from "../../features/auth/context/AuthProvider";
import "./index.css";

export default function Navbar() {
    const [isListDropdownVisible, setIsListDropdownVisible] = useState<boolean>(false);
    const navigate = useNavigate();
    const { user, logout, isSeller } = useAuth();

    async function onClickLogout(): Promise<void> {
        const messages: FormMessageStateType = await logout();
        if (messages.success) navigate("/login");
        console.log(messages);
    }

    function onClickNavUsername(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setIsListDropdownVisible(!isListDropdownVisible);
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
                    <Link to={"/"} className="navbar-item">
                        About Us
                    </Link>
                    <Link to={"/listings"} className="navbar-item">
                        Listings
                    </Link>
                    <Link to={"/"} className="navbar-item">
                        Find Agent
                    </Link>
                    {user ? (
                        <span>
                            <button type="button" onClick={onClickNavUsername} className="navbar-button">
                                <i className="fa-solid fa-user"></i>
                            </button>
                            {isListDropdownVisible ? (
                                <ListDropDown>
                                    <li>
                                        <Link to={"/listings/new"}>@{user.username}</Link>
                                    </li>
                                    {isSeller() ? (
                                        <li>
                                            <Link to={"/listings/new"}>Create Listing</Link>
                                        </li>
                                    ) : (
                                        <></>
                                    )}

                                    <li>
                                        <button type="button" onClick={onClickLogout}>
                                            Logout
                                        </button>
                                    </li>
                                </ListDropDown>
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
            </div>
        </header>
    );
}
