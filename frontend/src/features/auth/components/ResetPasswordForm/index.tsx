import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import InputWithLabel from "../../../../components/Forms/InputWithLabel";
import Message from "../../../../components/Message";
import "./index.css";

export default function ResetPasswordForm() {
    const { resetPassword, formMessages } = useAuth();
    const { token } = useParams();

    async function onSubmitPassword(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        const formData: FormData = new FormData(e.currentTarget);
        if (token) await resetPassword(formData, token);
    }

    return (
        <form onSubmit={onSubmitPassword} id="reset-password-form">
            {formMessages.success ? <Message type="success">{formMessages.success[0]}</Message> : <></>}

            {formMessages.non_field_errors ? <Message type="error">{formMessages.non_field_errors[0]}</Message> : <></>}

            <InputWithLabel name="new_password" type="password" id="new_password">
                Password
            </InputWithLabel>

            {formMessages.new_password ? <Message type="error">{formMessages.new_password[0]}</Message> : <></>}

            <InputWithLabel name="confirm_password" type="password" id="confirm_password">
                Confirm Password
            </InputWithLabel>

            {formMessages.confirm_password ? <Message type="error">{formMessages.confirm_password[0]}</Message> : <></>}

            <button type="submit">Change Password</button>
        </form>
    );
}
