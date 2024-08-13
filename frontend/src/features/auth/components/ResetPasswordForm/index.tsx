import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import InputWithLabel from "../../../../components/Forms/InputWithLabel";
import "./index.css";

export default function ResetPasswordForm() {
    const { resetPassword } = useAuth();
    const { token } = useParams();

    async function onSubmitPassword(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        const formData: FormData = new FormData(e.currentTarget);
        if (token) await resetPassword(formData, token);
    }

    return (
        <>
            <form onSubmit={onSubmitPassword} id="reset-password-form">
                <InputWithLabel name="new_password" type="password" id="new_password">
                    Password
                </InputWithLabel>
                <InputWithLabel name="confirm_password" type="password" id="confirm_password">
                    Confirm Password
                </InputWithLabel>
                <button type="submit">Change Password</button>
            </form>
        </>
    );
}
