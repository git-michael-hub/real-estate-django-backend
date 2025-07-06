import { Link } from "react-router-dom";
import ListDropDown from "../../List/ListDropDown";

type NavDropdownType = {
    setIsNavDropdownVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NavDropdown({ setIsNavDropdownVisible }: NavDropdownType) {
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
