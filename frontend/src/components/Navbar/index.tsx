import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../../features/auth/hooks/useAuth";
import BtnLink from "../Buttons/BtnLink";
import ListDropDown from "../List/ListDropDown";
import { FormMessageStateType } from "../../features/auth/context/AuthProvider";
import "./index.css";

export default function Navbar() {
    const [isLogoutFormVisible, setIsLogoutFormVisible] = useState<boolean>(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    async function onClickLogout(): Promise<void> {
        const messages: FormMessageStateType = await logout();
        if (messages.success) navigate("/login");
        console.log(messages);
    }

    function onClickNavUsername(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setIsLogoutFormVisible(!isLogoutFormVisible);
    }

    return (
        <nav id="navbar">
            <Link to={"/"}>Home</Link>
            {user ? (
                <span>
                    <BtnLink onClick={onClickNavUsername}>@{user.username}</BtnLink>
                    {isLogoutFormVisible ? (
                        <ListDropDown>
                            <li>
                                <Link to={"/listings/new"}>Create Listing</Link>
                            </li>
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
                <Link to={"/login"}>Login</Link>
            )}
        </nav>
    );
}
