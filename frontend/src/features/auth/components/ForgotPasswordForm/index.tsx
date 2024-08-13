import useAuth from "../../hooks/useAuth";
import InputWithLabel from "../../../../components/Forms/InputWithLabel";
import "./index.css";

export default function ForgotPasswordForm() {
    const { requestResetPassword } = useAuth();

    async function onSubmitRequest(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        const formData: FormData = new FormData(e.currentTarget);
        await requestResetPassword(formData);
    }

    return (
        <>
            <form onSubmit={onSubmitRequest} id="forgot-password-form">
                <InputWithLabel name="email" type="email" id="email">
                    Email
                </InputWithLabel>
                <button type="submit">Submit Request</button>
            </form>
        </>
    );
}
