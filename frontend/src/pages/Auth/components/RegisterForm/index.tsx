import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../../features/auth/hooks/useAuth";
import { AuthFormMessageType } from "../../../../types/types";
import FormBasic from "../../../../components/Forms/FormBasic";
import InputWithLabel from "../../../../components/Forms/InputWithLabel";
import BtnBasicActive from "../../../../components/Buttons/BtnBasicActive";
import Message from "../../../../components/Message";
import "./index.css";

export default function RegisterForm() {
    const [formMessages, setFormMessages] = useState<AuthFormMessageType>({});
    const [email, setEmail] = useState<string>("");
    const { register } = useAuth();
    const navigate = useNavigate();

    async function onSubmitForm(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        const formData: FormData = new FormData(e.currentTarget);
        const message: AuthFormMessageType = await register(formData);
        if (message.success) {
            setFormMessages({});
            navigate(`/email-verification/${email}`);
            return;
        }
        setFormMessages(message);
    }

    return (
        <FormBasic onSubmit={onSubmitForm} id="register-form">
            <div>
                {formMessages.error ? <Message type="error">{formMessages.error[0]}</Message> : <></>}
                {formMessages.non_field_errors ? (
                    <Message type="error">{formMessages.non_field_errors[0]}</Message>
                ) : (
                    <></>
                )}
            </div>

            <div>
                <InputWithLabel inputProps={{ name: "username" }}>Username</InputWithLabel>
                {formMessages.username ? <Message type="error">{formMessages.username[0]}</Message> : <></>}
            </div>

            <div>
                <InputWithLabel
                    inputProps={{ name: "email", type: "email", onChange: (e) => setEmail(e.currentTarget.value) }}
                >
                    Email
                </InputWithLabel>
                {formMessages.email ? <Message type="error">{formMessages.email[0]}</Message> : <></>}
            </div>

            <div>
                <InputWithLabel inputProps={{ name: "first_name" }}>First Name</InputWithLabel>
                {formMessages.first_name ? <Message type="error">{formMessages.first_name[0]}</Message> : <></>}
            </div>

            <div>
                <InputWithLabel inputProps={{ name: "last_name" }}>Last Name</InputWithLabel>
                {formMessages.last_name ? <Message type="error">{formMessages.last_name[0]}</Message> : <></>}
            </div>

            <div>
                <InputWithLabel inputProps={{ name: "password", type: "password" }}>Password</InputWithLabel>
                {formMessages.password ? <Message type="error">{formMessages.password[0]}</Message> : <></>}
            </div>

            <div>
                <InputWithLabel inputProps={{ name: "confirm_password", type: "password" }}>
                    Confirm Password
                </InputWithLabel>
            </div>

            <div>
                <BtnBasicActive type="submit">
                    <span>Next</span>
                </BtnBasicActive>
            </div>

            <div className="login-link">
                <span>
                    Already have an account? <Link to={"/login"}>Back to login</Link>
                </span>
            </div>
        </FormBasic>
    );
}
