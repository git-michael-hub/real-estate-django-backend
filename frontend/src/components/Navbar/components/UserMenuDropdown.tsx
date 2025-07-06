import { Link, useNavigate } from "react-router-dom";
import { C_AUTH } from "../../../constants/auth";
import { AuthFormMessageType } from "../../../types/formMessages";
import useAuth from "../../../features/auth/hooks/useAuth";
import ListDropDown from "../../List/ListDropDown";

type UserMenuDropdownType = {
    setIsUserMenuDropdownVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UserMenuDropdown({ setIsUserMenuDropdownVisible, setIsModalVisible }: UserMenuDropdownType) {
    const navigate = useNavigate();
    const { user, logout, getAuthRole } = useAuth();

    async function onClickLogout(): Promise<void> {
        const messages: AuthFormMessageType = await logout();
        if (messages.success) navigate("/login");
        console.log(messages);
    }

    function onClickSwitchAccount(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        setIsModalVisible(true);
    }

    return (
        <>
            <ListDropDown onClick={() => setIsUserMenuDropdownVisible(false)}>
                <li>
                    {getAuthRole() === C_AUTH.ACCOUNT_ROLE.BUYER ? (
                        <Link to={`/user/${user?.username}`}>@{user?.username}</Link>
                    ) : getAuthRole() === C_AUTH.ACCOUNT_ROLE.SELLER ? (
                        <Link to={`/sellers/${user?.username}`}>@{user?.username}</Link>
                    ) : getAuthRole() === C_AUTH.ACCOUNT_ROLE.AGENT ? (
                        <Link to={`/agents/${user?.username}`}>@{user?.username}</Link>
                    ) : (
                        <></>
                    )}
                </li>
                <li>
                    <Link to={"/my-real-estate/dashboard"}>Dashboard</Link>
                </li>
                <li>
                    <Link to="/" onClick={onClickSwitchAccount}>
                        Switch Account
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
