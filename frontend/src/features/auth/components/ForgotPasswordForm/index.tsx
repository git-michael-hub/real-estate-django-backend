import useAuth from "../../hooks/useAuth";
import InputWithLabel from "../../../../components/Forms/InputWithLabel";
import Message from "../../../../components/Message";
import "./index.css";
import { FormMessageStateType } from "../../context/AuthProvider";
import { useState } from "react";
import BtnBasic from "../../../../components/Buttons/BtnBasic";
import { Link } from "react-router-dom";

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
        <form onSubmit={onSubmitRequest} id="forgot-password-form">
            {formMessages.success ? <Message type="success">{formMessages.success[0]}</Message> : <></>}

            {formMessages.non_field_errors ? <Message type="error">{formMessages.non_field_errors[0]}</Message> : <></>}

            {formMessages.error ? <Message type="error">{formMessages.error[0]}</Message> : <></>}

            <div>
                <InputWithLabel name="email" type="email" id="email">
                    Email
                </InputWithLabel>

                {formMessages.email ? <Message type="error">{formMessages.email[0]}</Message> : <></>}
            </div>

            <div>
                <BtnBasic>
                    <span>Submit Request</span>
                </BtnBasic>
            </div>

            <div className="login-link">
                <Link to={"/login"}>Back to Sign In</Link>
            </div>
        </form>
    );
}
