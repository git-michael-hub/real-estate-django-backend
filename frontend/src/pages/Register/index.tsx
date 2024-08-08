import { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { apiFns } from "../../ts/api-service";
import "./index.css";

type TRegisterResponse = {
    isSuccess: boolean;
    message?: string;
    errors?: TErrMessage;
};

type TErrMessage = {
    readonly [errorType: string]: string[];
};

// const USER_ROLE = {
//     BUYER: "buyer",
//     SELLER: "seller",
//     AGENT: "agent",
// } as const;

export default function Register() {
    const [errMessage, setErrMessage] = useState<TErrMessage>({ generic: [""] });
    const navigate: NavigateFunction = useNavigate();

    async function onSubmitRegister(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        try {
            const registerData: FormData = new FormData(e.currentTarget);
            const response: TRegisterResponse = await apiFns.register(registerData);
            response.isSuccess ? navigate("/login") : setErrMessage(response.errors as TErrMessage);
        } catch {
            setErrMessage({ generic: ["An error occurred."] });
        }
    }

    return (
        <form onSubmit={onSubmitRegister} id="register-page">
            <h1>Register Page</h1>
            {errMessage.generic ? <p>{errMessage.generic[0]}</p> : <></>}
            {/* <div className="radio-container">
                <div>
                    <input type="radio" id={USER_ROLE.BUYER} name="role" value={USER_ROLE.BUYER} />
                    <label htmlFor="role">{USER_ROLE.BUYER}</label>
                </div>
                <div>
                    <input type="radio" id={USER_ROLE.SELLER} name="role" value={USER_ROLE.SELLER} />
                    <label htmlFor="role">{USER_ROLE.SELLER}</label>
                </div>
                <div>
                    <input type="radio" id={USER_ROLE.AGENT} name="role" value={USER_ROLE.AGENT} />
                    <label htmlFor="role">{USER_ROLE.AGENT}</label>
                </div>
            </div> */}
            <div>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" />
            </div>
            <div>
                <label htmlFor="first_name">First Name</label>
                <input type="text" name="first_name" />
            </div>
            <div>
                <label htmlFor="last_name">Last Name</label>
                <input type="text" name="last_name" />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" />
            </div>
            <div>
                <label htmlFor="confirm_password">Confirm Password</label>
                <input type="password" name="confirm_password" />
            </div>
            <div>
                <button type="submit">Sign Up</button>
            </div>
        </form>
    );
}
