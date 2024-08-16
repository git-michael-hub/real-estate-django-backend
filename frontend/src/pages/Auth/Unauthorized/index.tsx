import { useNavigate } from "react-router-dom";
import BtnBasic from "../../../components/Buttons/BtnBasic";

export default function Unauthorized() {
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    return (
        <main style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1>Unauthorized</h1>
            <div>
                <BtnBasic onClick={goBack}>
                    <span>Go Back</span>
                </BtnBasic>
            </div>
        </main>
    );
}
