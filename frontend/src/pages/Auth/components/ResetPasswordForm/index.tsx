import { Link, useParams } from "react-router-dom";
import useAuth from "../../../../features/auth/hooks/useAuth";
import InputWithLabel from "../../../../components/Forms/InputWithLabel";
import Message from "../../../../components/Message";
import { useState } from "react";
import { AuthFormMessageType } from "../../../../types/types";
import FormBasic from "../../../../components/Forms/FormBasic";
import BtnBasicActive from "../../../../components/Buttons/BtnBasicActive";
import "./index.css";

export default function ResetPasswordForm() {
    const [formMessages, setFormMessages] = useState<AuthFormMessageType>({});
    const { resetPassword } = useAuth();
    const { token } = useParams();

    async function onSubmitPassword(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        const formData: FormData = new FormData(e.currentTarget);
        if (token) {
            const messages: AuthFormMessageType = await resetPassword(formData, token);
            setFormMessages(messages);
        }
    }

    return (
        <FormBasic onSubmit={onSubmitPassword} id="reset-password-form">
            <h2>Reset Password</h2>

            {formMessages.success ? <Message type="success">{formMessages.success[0]}</Message> : <></>}

            {formMessages.error ? <Message type="error">{formMessages.error[0]}</Message> : <></>}

            {formMessages.non_field_errors ? <Message type="error">{formMessages.non_field_errors[0]}</Message> : <></>}

            <InputWithLabel inputProps={{ name: "password", type: "password" }}>Password</InputWithLabel>

            {formMessages.password ? <Message type="error">{formMessages.password[0]}</Message> : <></>}

            <InputWithLabel inputProps={{ name: "confirm_password", type: "password" }}>
                Confirm Password
            </InputWithLabel>

            {formMessages.confirm_password ? <Message type="error">{formMessages.confirm_password[0]}</Message> : <></>}

            <div>
                <BtnBasicActive type="submit">
                    <span>Change Password</span>
                </BtnBasicActive>
            </div>

            <div className="login-link">
                <Link to={"/login"}>Back to Sign In</Link>
            </div>
        </FormBasic>
    );
}
