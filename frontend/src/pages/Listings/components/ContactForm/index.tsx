import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ListingType } from "../../../../types/listing";
import { SellerAccountType } from "../../../../types/seller";
import { AgentAccountType } from "../../../../types/agent";
import { apiFns, APIResponseType } from "../../../../utils/api-service";
import { API_URLS } from "../../../../urls/api-urls";
import BtnBasicActive from "../../../../components/Buttons/BtnBasicActive";
import InputBasic from "../../../../components/Forms/InputBasic";
import TextAreaBasic from "../../../../components/Forms/TextAreaBasic";
import Message from "../../../../components/Message";
import "./index.css";

type ContactFormProps = {
    listing?: ListingType;
    agent_username?: string;
    seller_username?: string;
};

type ContactFormMessageStateType = {
    error?: string[];
    recipient_email?: string[];
    sender_name?: string[];
    sender_email?: string[];
    sender_contact_number?: string[];
    message?: string[];
};

export default function ContactForm({ listing, agent_username, seller_username }: ContactFormProps) {
    const [formMessages, setFormMessages] = useState<ContactFormMessageStateType>({});
    const [agent_account, setAgentAccount] = useState<AgentAccountType | null>(null);
    const [seller_account, setSellerAccount] = useState<SellerAccountType | null>(null);

    useEffect(() => {
        const fetchAgent = async (): Promise<void> => {
            if (!agent_username) return;
            const response: APIResponseType = await apiFns.get(API_URLS.AGENT.RETRIEVE(agent_username));
            if (!response.success) return;
            setAgentAccount(response.data as AgentAccountType);
        };
        const fetchSeller = async (): Promise<void> => {
            if (!seller_username) return;
            const response: APIResponseType = await apiFns.get(API_URLS.SELLER.RETRIEVE(seller_username));
            if (!response.success) return;
            setSellerAccount(response.data as SellerAccountType);
        };
        fetchAgent();
        fetchSeller();
    }, []);

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
            {agent_account ? (
                <>
                    <h3>Contact Agent</h3>
                    <div className="seller-contact-info-container">
                        <Link to={`/agents/@${agent_account.user.username}`}>
                            <img src={agent_account.profile_image_path} alt="" />
                        </Link>
                        <ul>
                            <Link to={`/agents/@${agent_account.user.username}`}>
                                <b>{agent_account.agent_name}</b>
                            </Link>
                            {agent_account.contact_number_1 ? (
                                <li>
                                    <i className="fa-solid fa-phone"></i> {agent_account.contact_number_1}
                                </li>
                            ) : (
                                <></>
                            )}
                            {agent_account.contact_number_2 ? (
                                <li>
                                    <i className="fa-solid fa-phone"></i> {agent_account.contact_number_2}
                                </li>
                            ) : (
                                <></>
                            )}
                        </ul>
                    </div>
                    <div className="contact-form-input">
                        {listing ? <input type="hidden" name="listing_id" value={listing.id} /> : <></>}
                        <input type="hidden" name="recipient_email" value={agent_account.user.email} />
                        {formMessages.error ? <Message type="error">{formMessages.error[0]}</Message> : <></>}
                        <div>
                            <InputBasic name="sender_name" placeholder="Name"></InputBasic>
                            {formMessages.sender_name ? (
                                <Message type="error">{formMessages.sender_name[0]}</Message>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div>
                            <InputBasic name="sender_email" placeholder="Email"></InputBasic>
                            {formMessages.sender_email ? (
                                <Message type="error">{formMessages.sender_email[0]}</Message>
                            ) : (
                                <></>
                            )}
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
                </>
            ) : (
                <></>
            )}
            {seller_account ? (
                <>
                    <h3>Contact Seller</h3>
                    <div className="seller-contact-info-container">
                        <Link to={`/sellers/${seller_account.user.username}`}>
                            <img src={seller_account.profile_image_path} alt="" />
                        </Link>
                        <ul>
                            <Link to={`/sellers/@${seller_account.user.username}`}>
                                <b>{seller_account.business_name}</b>
                            </Link>
                            <li>
                                <i className="fa-solid fa-phone"></i> {seller_account.contact_number_1}
                            </li>
                            {seller_account.contact_number_2 ? (
                                <li>
                                    <i className="fa-solid fa-phone"></i> {seller_account.contact_number_2}
                                </li>
                            ) : (
                                <></>
                            )}
                        </ul>
                    </div>
                    <div className="contact-form-input">
                        {listing ? <input type="hidden" name="listing_id" value={listing.id} /> : <></>}
                        <input type="hidden" name="recipient_email" value={seller_account.user.email} />
                        {formMessages.error ? <Message type="error">{formMessages.error[0]}</Message> : <></>}
                        <div>
                            <InputBasic name="sender_name" placeholder="Name"></InputBasic>
                            {formMessages.sender_name ? (
                                <Message type="error">{formMessages.sender_name[0]}</Message>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div>
                            <InputBasic name="sender_email" placeholder="Email"></InputBasic>
                            {formMessages.sender_email ? (
                                <Message type="error">{formMessages.sender_email[0]}</Message>
                            ) : (
                                <></>
                            )}
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
                    </div>{" "}
                </>
            ) : (
                <></>
            )}
        </form>
    );
}
