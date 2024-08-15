import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    return (
        <main>
            <h1>Unauthorized</h1>
            <div>
                <button onClick={goBack}>Go Back</button>
            </div>
        </main>
    );
}
