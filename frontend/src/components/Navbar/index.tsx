import { Link, useNavigate } from "react-router-dom";
import "./index.css";
import useAuth from "../../features/auth/hooks/useAuth";
import { FormMessageStateType } from "../../features/auth/context/AuthProvider";
import { useState } from "react";
import BtnLink from "../Buttons/BtnLink";
import ListDropDown from "../List/ListDropDown";
import BtnListItem from "../Buttons/BtnListItem";

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
                                <BtnListItem onClick={onClickLogout}>Logout</BtnListItem>
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
