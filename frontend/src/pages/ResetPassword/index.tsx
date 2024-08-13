import { useParams } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useAuth";
import InputWithLabel from "../../components/Forms/InputWithLabel";
// //localhost:8000/user/reset-password/cbpg64-7cad4d624be59432a60a6e1792c9ac21
// http:

export default function ResetPassword() {
    const { resetPassword } = useAuth();
    const { token } = useParams();

    async function onSubmitPassword(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        const formData: FormData = new FormData(e.currentTarget);
        if (token) await resetPassword(formData, token);
    }

    return (
        <>
            <form onSubmit={onSubmitPassword}>
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
