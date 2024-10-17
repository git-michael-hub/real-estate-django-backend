import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { FormMessageStateType } from "../../context/AuthProvider";
import helperFn from "../../../../ts/helper";
import InputWithLabel from "../../../../components/Forms/InputWithLabel";
import Message from "../../../../components/Message";
import BtnBasic from "../../../../components/Buttons/BtnBasic";
import "./index.css";
import FormWithRef from "../../../../components/Forms/FormWithRef";

type RegisterPages = 1 | 2 | 3;

export default function RegisterForm() {
    const [page, setPage] = useState<RegisterPages>(1);
    const [partialFormData, setPartialFormData] = useState<FormData | null>(null);
    const [formMessages, setFormMessages] = useState<FormMessageStateType>({});
    const formRef = useRef<HTMLFormElement>(null);
    const { register, requestEmailValidation } = useAuth();

    async function onClickNext(): Promise<void> {
        const form: HTMLFormElement | null = formRef.current;
        if (form) {
            const formData: FormData = new FormData(form);
            const message: FormMessageStateType = await requestEmailValidation("buyers/email-validation", formData);
            if (message.success) {
                setPartialFormData(formData);
                setFormMessages({});
                setPage(2);
                return;
            }
            setFormMessages(message);
        }
    }

    async function onSubmitForm(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        const partialFormData2: FormData = new FormData(e.currentTarget);
        if (partialFormData) {
            const completeFormData = helperFn.combineFormData(partialFormData, partialFormData2);
            const message: FormMessageStateType = await register("buyers/register", completeFormData);
            setFormMessages(message);
            if (message.success) {
                setPartialFormData(null);
                setPage(3);
                return;
            }
            console.log(message);
        }
    }

    return (
        <FormWithRef onSubmit={onSubmitForm} id="register-form" ref={formRef}>
            <div>
                <h2>Register</h2>
            </div>

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
                        <span>
                            Already have an account? <Link to={"/login"}>Back to login</Link>
                        </span>
                    </div>
                </>
            ) : page === 2 ? (
                <>
                    <div>
                        <p>We have sent a One-Time-PIN to your Email Address.</p>
                    </div>
                    {formMessages.success ? <Message type="success">{formMessages.success}</Message> : <></>}

                    <div>
                        <InputWithLabel inputProps={{ type: "number", name: "pin_code", id: "pin" }}>
                            Enter One-Time-PIN
                        </InputWithLabel>
                        {formMessages.non_field_errors ? <Message type="error">Invalid PIN.</Message> : <></>}
                        {formMessages.pin_code ? <Message type="error">{formMessages.pin_code}</Message> : <></>}
                        {formMessages.error ? <Message type="error">{formMessages.error}</Message> : <></>}
                    </div>

                    <div>
                        <BtnBasic type="submit">
                            <span>Register</span>
                        </BtnBasic>
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <p>Registration Complete!</p>
                    </div>

                    <div className="login-link">
                        <Link to={"/login"}>Back to login</Link>
                    </div>
                </>
            )}
        </FormWithRef>
    );
}
