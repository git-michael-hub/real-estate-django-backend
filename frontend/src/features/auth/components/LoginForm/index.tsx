import useAuth from "../../hooks/useAuth";
import InputWithLabel from "../../../../components/Forms/InputWithLabel";
import Message from "../../../../components/Message";
import "./index.css";
import { useState } from "react";
import { FormMessageStateType } from "../../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import BtnBasic from "../../../../components/Buttons/BtnBasic";

export default function LoginForm() {
    const [formMessages, setFormMessages] = useState<FormMessageStateType>({});
    const navigate = useNavigate();
    const { login } = useAuth();

    async function onSubmitForm(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        const formData: FormData = new FormData(e.currentTarget);
        const messages: FormMessageStateType = await login(formData);
        if (messages.success) {
            navigate("/");
        }
        setFormMessages(messages);
    }

    return (
        <form onSubmit={onSubmitForm} id="login-form">
            <div>
                {formMessages.success ? <Message type="success">{formMessages.success[0]}</Message> : <></>}

                {formMessages.error ? <Message type="error">{formMessages.error[0]}</Message> : <></>}

                {formMessages.non_field_errors ? (
                    <Message type="error">{formMessages.non_field_errors[0]}</Message>
                ) : (
                    <></>
                )}
            </div>

            <div>
                <InputWithLabel name="username" id="username">
                    Username
                </InputWithLabel>

                {formMessages.username ? <Message type="error">{formMessages.username[0]}</Message> : <></>}
            </div>

            <div>
                <InputWithLabel name="password" id="password" type="password">
                    Password
                </InputWithLabel>

                {formMessages.password ? <Message type="error">{formMessages.password[0]}</Message> : <></>}
            </div>

            <div className="forgot-password-link">
                <Link to={"/forgot-password"}>Forgot Password?</Link>
            </div>

            <div>
                <BtnBasic>
                    <span>Login</span>
                </BtnBasic>
            </div>
            <div className="register-link">
                <span>
                    Don't have an account yet? <Link to={"/register"}>Sign up</Link>
                </span>
            </div>
        </form>
    );
}
