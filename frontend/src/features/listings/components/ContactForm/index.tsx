import { Link } from "react-router-dom";
import BtnBasic from "../../../../components/Buttons/BtnBasic";
import InputBasic from "../../../../components/Forms/InputBasic";
import TextAreaBasic from "../../../../components/Forms/TextAreaBasic";
import { ListingType } from "../ListingEntry";
import "./index.css";

type ContactFormProps = {
    listing: ListingType;
};

export default function ContactForm({ listing }: ContactFormProps) {
    return (
        <form className="contact-form">
            <h3>Contact Agent</h3>
            <div className="seller-contact-info-container">
                <img src={listing?.seller.seller_image_url} alt="" />
                <ul>
                    <Link to={""}>
                        <b>
                            {listing?.seller.first_name} {listing?.seller.last_name}
                        </b>
                    </Link>
                    <li>
                        <i className="fa-solid fa-phone"></i> {listing?.seller.contact_number_1}
                    </li>
                    {listing.seller.contact_number_2 ? (
                        <li>
                            <i className="fa-solid fa-phone"></i> {listing?.seller.contact_number_2}
                        </li>
                    ) : (
                        <></>
                    )}
                </ul>
            </div>
            <div className="contact-form-input">
                <InputBasic name="name" placeholder="Name"></InputBasic>
                <InputBasic name="Email" placeholder="Email"></InputBasic>
                <InputBasic name="Phone" placeholder="Phone"></InputBasic>
                <TextAreaBasic name="message" placeholder="Message"></TextAreaBasic>
                <BtnBasic>Send Message</BtnBasic>
            </div>
        </form>
    );
}
