import useUser from "../../hooks/useUser";
import InputWithLabel from "../../../../components/Forms/InputWithLabel";
import Message from "../../../../components/Message";
import "./index.css";

export default function LoginForm() {
    const { login, formMessages } = useUser();

    async function onSubmitForm(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        const formData: FormData = new FormData(e.currentTarget);
        await login(formData);
    }

    return (
        <form onSubmit={onSubmitForm} id="login-form">
            {formMessages.success_message ? <Message type="success">{formMessages.success_message[0]}</Message> : <></>}

            {formMessages.generic_message ? <Message type="error">{formMessages.generic_message[0]}</Message> : <></>}

            {formMessages.non_field_errors ? <Message type="error">{formMessages.non_field_errors[0]}</Message> : <></>}

            <InputWithLabel name="username" id="username">
                Username:
            </InputWithLabel>

            {formMessages.username ? <Message type="error">{formMessages.username[0]}</Message> : <></>}

            <InputWithLabel name="password" id="password" type="password">
                Password:
            </InputWithLabel>

            {formMessages.password ? <Message type="error">{formMessages.password[0]}</Message> : <></>}

            <div>
                <button type="submit">Login</button>
            </div>
        </form>
    );
}
