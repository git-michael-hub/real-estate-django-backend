import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { FormMessageStateType } from "../../context/AuthProvider";
import helperFn from "../../../../ts/helper";
import InputWithLabel from "../../../../components/Forms/InputWithLabel";
import Message from "../../../../components/Message";
import BtnBasic from "../../../../components/Buttons/BtnBasic";
import "./index.css";

type RegisterPages = 1 | 2 | 3;

export default function RegisterForm() {
    const [page, setPage] = useState<RegisterPages>(1);
    const [partialFormData, setPartialFormData] = useState<FormData | null>(null);
    const [formMessages, setFormMessages] = useState<FormMessageStateType>({});
    const formRef = useRef<HTMLFormElement | null>(null);
    const { register, requestEmailVerification } = useAuth();

    async function onClickNext(): Promise<void> {
        const form: HTMLFormElement | null = formRef.current;
        if (form) {
            const formData: FormData = new FormData(form);
            const message: FormMessageStateType = await requestEmailVerification(formData);
            setFormMessages(message);
            console.log(message);

            if (!message.success) return;
            setPartialFormData(formData);
            setFormMessages({});
            setPage(2);
        }
    }

    async function onSubmitForm(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        const partialFormData2: FormData = new FormData(e.currentTarget);
        if (partialFormData) {
            const completeFormData = helperFn.combineFormData(partialFormData, partialFormData2);
            const message: FormMessageStateType = await register(completeFormData);
            setFormMessages(message);
            console.log(message);

            if (!message.success) return;
            setPartialFormData(null);
            setPage(3);
        }
    }

    return (
        <form onSubmit={onSubmitForm} id="register-form" ref={formRef}>
            {page === 1 ? (
                <>
                    <div>
                        {formMessages.error ? <Message type="error">{formMessages.error[0]}</Message> : <></>}
                        {formMessages.non_field_errors ? (
                            <Message type="error">{formMessages.non_field_errors[0]}</Message>
                        ) : (
                            <></>
                        )}
                    </div>

                    <div>
                        <InputWithLabel inputProps={{ name: "username" }}>Username</InputWithLabel>
                        {formMessages.username ? <Message type="error">{formMessages.username[0]}</Message> : <></>}
                    </div>

                    <div>
                        <InputWithLabel inputProps={{ name: "email", type: "email" }}>Email</InputWithLabel>
                        {formMessages.email ? <Message type="error">{formMessages.email[0]}</Message> : <></>}
                    </div>

                    <div>
                        <InputWithLabel inputProps={{ name: "first_name" }}>First Name</InputWithLabel>
                        {formMessages.first_name ? <Message type="error">{formMessages.first_name[0]}</Message> : <></>}
                    </div>

                    <div>
                        <InputWithLabel inputProps={{ name: "last_name" }}>Last Name</InputWithLabel>
                        {formMessages.last_name ? <Message type="error">{formMessages.last_name[0]}</Message> : <></>}
                    </div>

                    <div>
                        <InputWithLabel inputProps={{ name: "password", type: "password" }}>Password</InputWithLabel>
                        {formMessages.password ? <Message type="error">{formMessages.password[0]}</Message> : <></>}
                    </div>

                    <div>
                        <InputWithLabel inputProps={{ name: "confirm_password", type: "password" }}>
                            Confirm Password
                        </InputWithLabel>
                    </div>

                    <div>
                        <BtnBasic onClick={onClickNext}>
                            <span>Next</span>
                        </BtnBasic>
                    </div>

                    <div className="login-link">
                        <Link to={"/login"}>Back to login</Link>
                    </div>
                </>
            ) : page === 2 ? (
                <>
                    {formMessages.success ? <Message type="success">{formMessages.success}</Message> : <></>}

                    <div>
                        <InputWithLabel inputProps={{ type: "number", name: "pin", id: "pin" }}>
                            Enter One-Time-PIN
                        </InputWithLabel>
                        {formMessages.non_field_errors ? <Message type="error">Invalid PIN.</Message> : <></>}
                        {formMessages.error ? <Message type="error">{formMessages.error}</Message> : <></>}
                        {formMessages.pin ? <Message type="error">{formMessages.pin}</Message> : <></>}
                    </div>

                    <div>
                        <BtnBasic type="submit">
                            <span>Register</span>
                        </BtnBasic>
                    </div>
                </>
            ) : (
                <>
                    {formMessages.success ? <Message type="success">{formMessages.success[0]}</Message> : <></>}
                    <div className="login-link">
                        <Link to={"/login"}>Back to login</Link>
                    </div>
                </>
            )}
        </form>
    );
}
