import useAuth from "../../hooks/useAuth";
import InputWithLabel from "../../../../components/Forms/InputWithLabel";
import Message from "../../../../components/Message";
import "./index.css";
import { FormMessageStateType } from "../../context/AuthProvider";
import { useState } from "react";
import BtnBasic from "../../../../components/Buttons/BtnBasic";
import { Link } from "react-router-dom";
import FormBasic from "../../../../components/Forms/FormBasic";

export default function ForgotPasswordForm() {
    const [formMessages, setFormMessages] = useState<FormMessageStateType>({});
    const { requestResetPassword } = useAuth();

    async function onSubmitRequest(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        const formData: FormData = new FormData(e.currentTarget);
        const messages: FormMessageStateType = await requestResetPassword(formData);
        setFormMessages(messages);
    }

    return (
        <FormBasic onSubmit={onSubmitRequest} id="forgot-password-form">
            <div>
                <h2>Forgot Password</h2>
            </div>

            <div>
                <p> You will receive a link in your email to reset your old password and create a new one.</p>
            </div>

            <div>
                <InputWithLabel inputProps={{ name: "email", type: "email" }}>Enter your email address</InputWithLabel>

                {formMessages.email ? <Message type="error">{formMessages.email[0]}</Message> : <></>}

                {formMessages.success ? <Message type="success">{formMessages.success[0]}</Message> : <></>}

                {formMessages.non_field_errors ? (
                    <Message type="error">{formMessages.non_field_errors[0]}</Message>
                ) : (
                    <></>
                )}

                {formMessages.error ? <Message type="error">{formMessages.error[0]}</Message> : <></>}
            </div>

            <div>
                <BtnBasic>
                    <span>Submit Request</span>
                </BtnBasic>
            </div>

            <div className="login-link">
                <Link to={"/login"}>Back to Sign In</Link>
            </div>
        </FormBasic>
    );
}
