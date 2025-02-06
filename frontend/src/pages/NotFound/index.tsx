import { Link, useNavigate } from "react-router-dom";
import "./index.css";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div id="not-found-page">
            <h2>Page Does Not Exist.</h2>
            <Link
                to={".."}
                onClick={(e) => {
                    e.preventDefault();
                    navigate(-1);
                }}
            >
                Go back
            </Link>
        </div>
    );
}
