import { Link } from "react-router-dom";
import BtnBasic from "../../../../components/Buttons/BtnBasic";
import InputBasic from "../../../../components/Forms/InputBasic";
import TextAreaBasic from "../../../../components/Forms/TextAreaBasic";
import { ListingType } from "../../context/ListingsProvider";
import { SellerType, SellerDetailsType } from "../../../sellers/context/SellersProvider";
import "./index.css";

type ContactFormProps = {
    listing?: ListingType;
    seller: SellerType | SellerDetailsType;
};

export default function ContactForm({ listing, seller }: ContactFormProps) {
    return (
        <form className="contact-form">
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
                <InputBasic name="name" placeholder="Name"></InputBasic>
                <InputBasic name="Email" placeholder="Email"></InputBasic>
                <InputBasic name="Phone" placeholder="Phone"></InputBasic>
                <TextAreaBasic name="message" placeholder="Message"></TextAreaBasic>
                <BtnBasic>Send Message</BtnBasic>
            </div>
        </form>
    );
}
