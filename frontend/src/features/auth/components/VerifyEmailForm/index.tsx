import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import InputWithLabel from "../../../../components/Forms/InputWithLabel";
import Message from "../../../../components/Message";
import helperFn from "./ts/helper";
import "./index.css";

export default function VerifyEmailForm() {
    const { state } = useLocation();
    const { data } = state;
    const { completeRegistration, formMessages } = useAuth();

    async function onSubmitCompleteRegister(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        const formData: FormData = helperFn.convertArrayObjectsToForm(data);
        const additionalFormData: FormData = new FormData(e.currentTarget);
        const pin: FormDataEntryValue = additionalFormData.get("pin") as FormDataEntryValue; // PRONE TO ERROR: FIND FIX IN FUTURE
        formData.append("pin", pin);
        await completeRegistration(formData);
    }

    return (
        <form onSubmit={onSubmitCompleteRegister} id="register-form">
            <h1>Enter One-Time-PIN</h1>

            {formMessages.error ? <Message type="error">{formMessages.error}</Message> : <></>}

            <InputWithLabel type="number" name="pin" id="pin">
                PIN
            </InputWithLabel>

            <div>
                <button type="submit">Complete Registration</button>
            </div>
        </form>
    );
}
