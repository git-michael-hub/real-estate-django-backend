import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../../../features/auth/hooks/useAuth";
import { AuthFormMessageType } from "../../../../types/formMessages";
import FormBasic from "../../../../components/Forms/FormBasic";
import InputWithLabel from "../../../../components/Forms/InputWithLabel";
import Message from "../../../../components/Message";
import BtnBasicActive from "../../../../components/Buttons/BtnBasicActive";
import "./index.css";

export default function EmailVerificationForm() {
    const [page, setPage] = useState<1 | 2>(1);
    const [formMessages, setFormMessages] = useState<AuthFormMessageType>({});
    const { email } = useParams();
    const { verifyEmail } = useAuth();

    async function onSubmitForm(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        if (!email) return;

        const formData: FormData = new FormData(e.currentTarget);
        const message: AuthFormMessageType = await verifyEmail(email, formData);

        if (message.success) {
            setPage(2);
            return;
        }

        setFormMessages(message);
        console.log(message);
    }

    return (
        <FormBasic onSubmit={onSubmitForm} id="email-verification-form">
            {page == 1 ? (
                <>
                    <div>
                        <h2>Email Verification</h2>
                    </div>
                    <div>
                        <p>We have sent a One-Time-PIN to your Email Address.</p>
                    </div>
                    {formMessages.success ? <Message type="success">{formMessages.success}</Message> : <></>}
                    <div>
                        <InputWithLabel inputProps={{ type: "number", name: "email_verification_pin", id: "pin" }}>
                            Enter One-Time-PIN
                        </InputWithLabel>
                        {formMessages.non_field_errors ? <Message type="error">Invalid PIN.</Message> : <></>}
                        {formMessages.email_verification_pin ? (
                            <Message type="error">{formMessages.email_verification_pin}</Message>
                        ) : (
                            <></>
                        )}
                        {formMessages.error ? <Message type="error">{formMessages.error}</Message> : <></>}
                    </div>
                    <div>
                        <BtnBasicActive type="submit">
                            <span>Verify Email</span>
                        </BtnBasicActive>
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
        </FormBasic>
    );
}
