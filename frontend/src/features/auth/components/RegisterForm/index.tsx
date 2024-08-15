import { useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import InputWithLabel from "../../../../components/Forms/InputWithLabel";
import Message from "../../../../components/Message";
import { FormMessageStateType } from "../../context/AuthProvider";
import helperFn from "../../../../ts/helper";
import "./index.css";

type TwoPages = 1 | 2 | 3;

export default function RegisterForm() {
    const [page, setPage] = useState<TwoPages>(1);
    const [partialFormData, setPartialFormData] = useState<FormData | null>(null);
    const [formMessages, setFormMessages] = useState<FormMessageStateType>({});
    const formRef = useRef<HTMLFormElement | null>(null);
    const { register, completeRegistration } = useAuth();

    async function onClickNext(): Promise<void> {
        const form: HTMLFormElement | null = formRef.current;
        if (form) {
            const formData: FormData = new FormData(form);
            const message: FormMessageStateType = await register(formData);
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
            const message: FormMessageStateType = await completeRegistration(completeFormData);
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
                <div>
                    <h1>Register Page</h1>

                    {formMessages.error ? <Message type="error">{formMessages.error[0]}</Message> : <></>}

                    {formMessages.non_field_errors ? (
                        <Message type="error">{formMessages.non_field_errors[0]}</Message>
                    ) : (
                        <></>
                    )}

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
                        <button onClick={onClickNext}>Next</button>
                    </div>
                </div>
            ) : page === 2 ? (
                <div>
                    <h1>Enter One-Time-PIN</h1>

                    {formMessages.error ? <Message type="error">{formMessages.error}</Message> : <></>}

                    {formMessages.success ? <Message type="success">{formMessages.success}</Message> : <></>}

                    <InputWithLabel type="number" name="pin" id="pin">
                        PIN
                    </InputWithLabel>

                    <div>
                        <button type="submit">Complete Registration</button>
                    </div>
                </div>
            ) : (
                <div>{formMessages.success ? <Message type="success">{formMessages.success[0]}</Message> : <></>}</div>
            )}
        </form>
    );
}
