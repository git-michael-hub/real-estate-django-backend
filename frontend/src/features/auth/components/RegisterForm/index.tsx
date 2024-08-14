import useAuth from "../../hooks/useAuth";
import InputWithLabel from "../../../../components/Forms/InputWithLabel";
import Message from "../../../../components/Message";
import "./index.css";

export default function RegisterForm() {
    const { register, formMessages } = useAuth();

    async function onSubmitRegister(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        const formData: FormData = new FormData(e.currentTarget);
        await register(formData);
    }

    return (
        <form onSubmit={onSubmitRegister} id="register-form">
            <h1>Register Page</h1>

            {formMessages.error ? <Message type="error">{formMessages.error[0]}</Message> : <></>}

            {formMessages.non_field_errors ? <Message type="error">{formMessages.non_field_errors[0]}</Message> : <></>}
            {/* <div className="radio-container">
                <div>
                    <input type="radio" id={USER_ROLE.BUYER} name="role" value={USER_ROLE.BUYER} />
                    <label htmlFor="role">{USER_ROLE.BUYER}</label>
                </div>
                <div>
                    <input type="radio" id={USER_ROLE.SELLER} name="role" value={USER_ROLE.SELLER} />
                    <label htmlFor="role">{USER_ROLE.SELLER}</label>
                </div>
                <div>
                    <input type="radio" id={USER_ROLE.AGENT} name="role" value={USER_ROLE.AGENT} />
                    <label htmlFor="role">{USER_ROLE.AGENT}</label>
                </div>
            </div> */}

            <InputWithLabel name="username" id="username">
                Username
            </InputWithLabel>

            {formMessages.username ? <Message type="error">{formMessages.username[0]}</Message> : <></>}

            <InputWithLabel name="email" id="email" type="email">
                Email
            </InputWithLabel>

            {formMessages.email ? <Message type="error">{formMessages.email[0]}</Message> : <></>}

            <InputWithLabel name="first_name" id="first_name">
                First Name
            </InputWithLabel>

            {formMessages.first_name ? <Message type="error">{formMessages.first_name[0]}</Message> : <></>}

            <InputWithLabel name="last_name" id="last_name">
                Last Name
            </InputWithLabel>

            {formMessages.last_name ? <Message type="error">{formMessages.last_name[0]}</Message> : <></>}

            <InputWithLabel name="password" id="password" type="password">
                Password
            </InputWithLabel>

            {formMessages.password ? <Message type="error">{formMessages.password[0]}</Message> : <></>}

            <InputWithLabel name="confirm_password" id="confirm_password" type="password">
                Confirm Password
            </InputWithLabel>

            <div>
                <button type="submit">Next</button>
            </div>
        </form>
    );
}
