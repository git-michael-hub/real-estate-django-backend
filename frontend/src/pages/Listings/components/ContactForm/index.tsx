import { Link } from "react-router-dom";
import BtnBasicActive from "../../../../components/Buttons/BtnBasicActive";
import InputBasic from "../../../../components/Forms/InputBasic";
import TextAreaBasic from "../../../../components/Forms/TextAreaBasic";
import { ListingType } from "../../../../features/listings/context/ListingsProvider";
import { SellerType, SellerDetailsType } from "../../../../features/sellers/context/SellersProvider";
import { apiFns, APIResponseType } from "../../../../utils/api-service";
import "./index.css";
import Message from "../../../../components/Message";
import { useState } from "react";

type ContactFormProps = {
    listing?: ListingType;
    seller: SellerType | SellerDetailsType;
};

type ContactFormMessageStateType = {
    error?: string[];
    agent_email?: string[];
    sender_name?: string[];
    sender_email?: string[];
    sender_contact_number?: string[];
    message?: string[];
};

export default function ContactForm({ listing, seller }: ContactFormProps) {
    const [formMessages, setFormMessages] = useState<ContactFormMessageStateType>({});

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const formData: FormData = new FormData(e.currentTarget);
            const response: APIResponseType = await apiFns.post("api/inquiries/mail_inquiry", formData);
            if (response.success) {
                setFormMessages({});
                alert("Successfully sent inquiry.");
            } else setFormMessages(response.data);
        } catch (error) {
            console.log(error);
            alert("An error occurred.");
        }
    }

    return (
        <form className="contact-form" onSubmit={onSubmit}>
            <h3>Contact Agent</h3>
            <div className="seller-contact-info-container">
                <Link to={`/agents/@${seller.username}`}>
                    <img src={seller.seller_image_url} alt="" />
                </Link>
                <ul>
                    <Link to={`/agents/@${seller.username}`}>
                        <b>
                            {seller.first_name} {seller.last_name}
                        </b>
                    </Link>
                    <li>
                        <i className="fa-solid fa-phone"></i> {seller.contact_number_1}
                    </li>
                    {seller.contact_number_2 ? (
                        <li>
                            <i className="fa-solid fa-phone"></i> {seller.contact_number_2}
                        </li>
                    ) : (
                        <></>
                    )}
                </ul>
            </div>
            <div className="contact-form-input">
                {listing ? <input type="hidden" name="listing_id" value={listing.id} /> : <></>}
                <input type="hidden" name="agent_email" value={seller.email} />
                {formMessages.error ? <Message type="error">{formMessages.error[0]}</Message> : <></>}
                <div>
                    <InputBasic name="sender_name" placeholder="Name"></InputBasic>
                    {formMessages.sender_name ? <Message type="error">{formMessages.sender_name[0]}</Message> : <></>}
                </div>
                <div>
                    <InputBasic name="sender_email" placeholder="Email"></InputBasic>
                    {formMessages.sender_email ? <Message type="error">{formMessages.sender_email[0]}</Message> : <></>}
                </div>
                <div>
                    <InputBasic name="sender_contact_number" placeholder="Phone"></InputBasic>
                    {formMessages.sender_contact_number ? (
                        <Message type="error">{formMessages.sender_contact_number[0]}</Message>
                    ) : (
                        <></>
                    )}
                </div>
                <div>
                    <TextAreaBasic name="message" placeholder="Message"></TextAreaBasic>
                    {formMessages.message ? <Message type="error">{formMessages.message[0]}</Message> : <></>}
                </div>
                <BtnBasicActive type="submit">Send Message</BtnBasicActive>
            </div>
        </form>
    );
}
