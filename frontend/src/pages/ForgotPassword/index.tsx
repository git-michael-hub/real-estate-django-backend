import { Link } from "react-router-dom";
import InputWithLabel from "../../components/Forms/InputWithLabel";
import useAuth from "../../features/auth/hooks/useAuth";

export default function ForgotPassword() {
    const { requestResetPassword } = useAuth();

    async function onSubmitRequest(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        const formData: FormData = new FormData(e.currentTarget);
        await requestResetPassword(formData);
    }

    return (
        <>
            <form onSubmit={onSubmitRequest}>
                <InputWithLabel name="email" type="email" id="email">
                    Email
                </InputWithLabel>
                <button type="submit">Submit Request</button>
            </form>
            <Link to={"/login"}>Login</Link>
        </>
    );
}
