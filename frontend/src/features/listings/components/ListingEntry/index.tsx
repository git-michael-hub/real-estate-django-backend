import { Link } from "react-router-dom";
import "./index.css";

export type ListingType = {
    id: number;
    owner: number;
    title: string;
    listing_type: string;
    listing_type_display: string;
    property_type: string;
    property_type_display: string;
    price: number;
    image?: string;
    property_size: number;
    description: string;
    is_available: boolean;
    bedrooms?: number;
    bathrooms?: number;
    province: string;
    city: string;
    baranggay: string;
    street: string;
};

type ListingEntryProp = {
    listing: ListingType;
};

export default function ListingEntry({ listing }: ListingEntryProp) {
    return (
        <>
            {listing.is_available ? (
                <>
                    <li key={listing.id} className="listing-entry">
                        <h2>
                            <Link to={`/listings/${listing.id}`}>{listing.title}</Link>
                        </h2>
                        {listing.image ? (
                            <img src={listing.image} alt="" className="listing-image" />
                        ) : (
                            <figure>
                                <Link to={`/listings/${listing.id}`}>
                                    <img src={"/images/default_house_for_sale.jpg"} alt="" className="listing-image" />
                                </Link>
                                {/* NOTE: ATTRIBUTION IS DEVELOPMENT ONLY. SHOULD PROVIDE OWN DEFAULT IMAGE ON PRODUCTION. */}
                                <figcaption className="listing-image-figcaption">
                                    Image by{" "}
                                    <Link
                                        target="_blank"
                                        rel="noopener"
                                        to="https://www.freepik.com/free-photo/house-with-yard-sign-sale_25625077.htm#fromView=search&page=1&position=2&uuid=c32d462e-2f45-43ad-887d-8f8818355d1b"
                                    >
                                        Freepik
                                    </Link>
                                </figcaption>
                            </figure>
                        )}

                        <br />
                        <b>{listing.property_type_display}</b>
                        <br />
                        <em>({listing.listing_type_display})</em>
                        <address>{`${listing.street}, ${listing.baranggay}, ${listing.city}, ${listing.province}`}</address>
                        <span>Php {listing.price.toString()}</span>
                        <br />
                        <span>{listing.property_size.toString()} sqm</span>
                        <br />
                        {listing.bedrooms ? <span>Bedrooms: {listing.bedrooms.toString()}</span> : <></>}
                        <br />
                        {listing.bathrooms ? <span>Bathrooms: {listing.bathrooms.toString()}</span> : <></>}
                    </li>
                </>
            ) : (
                <></>
            )}
        </>
    );
}
