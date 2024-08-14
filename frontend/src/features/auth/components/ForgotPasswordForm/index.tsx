import useAuth from "../../hooks/useAuth";
import InputWithLabel from "../../../../components/Forms/InputWithLabel";
import Message from "../../../../components/Message";
import "./index.css";

export default function ForgotPasswordForm() {
    const { requestResetPassword, formMessages } = useAuth();

    async function onSubmitRequest(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        const formData: FormData = new FormData(e.currentTarget);
        await requestResetPassword(formData);
    }

    return (
        <form onSubmit={onSubmitRequest} id="forgot-password-form">
            {formMessages.success ? <Message type="success">{formMessages.success[0]}</Message> : <></>}

            {formMessages.non_field_errors ? <Message type="error">{formMessages.non_field_errors[0]}</Message> : <></>}

            <InputWithLabel name="email" type="email" id="email">
                Email
            </InputWithLabel>

            {formMessages.email ? <Message type="error">{formMessages.email[0]}</Message> : <></>}

            <button type="submit">Submit Request</button>
        </form>
    );
}
