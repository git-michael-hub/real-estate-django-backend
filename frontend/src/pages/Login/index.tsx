import { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { apiFns } from "../../ts/api-service";
import "./index.css";

type TLoginResponse = {
    isSuccess: boolean;
    message: string;
};

export default function Login() {
    const [errMessage, setErrMessage] = useState<string>("");
    const navigate: NavigateFunction = useNavigate();

    async function onSubmitLogin(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        try {
            const loginData: FormData = new FormData(e.currentTarget);
            const response: TLoginResponse = await apiFns.login(loginData);
            response.isSuccess ? navigate("/") : setErrMessage(response.message);
        } catch {
            setErrMessage("An error occurred.");
        }
    }

    return (
        <form onSubmit={onSubmitLogin}>
            <h1>Login Page</h1>
            {errMessage !== "" ? <p>{errMessage}</p> : <></>}
            <div>
                <label htmlFor="username">Username: </label>
                <input type="text" name="username" id="username" />
            </div>
            <div>
                <label htmlFor="password">Password: </label>
                <input type="password" name="password" id="password" />
            </div>
            <div>
                <button type="submit">Login</button>
            </div>
        </form>
    );
}
