import { Link } from "react-router-dom";
import "./index.css";
import useAuth from "../../../auth/hooks/useAuth";
import { apiFns, APIResponseType, HeaderType } from "../../../../ts/api-service";
import cookieHandler, { Token } from "../../../../ts/cookie-handler";

export type SellerListType = {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    contact_number_1: number;
    contact_number_2?: number;
    seller_image_url: string;
};

export type ListingType = {
    id: number;
    seller: SellerListType;
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
    favoriteListings: any[]; // MUST CREATE TYPE FOR FAVORITELISTINGS!
    setFavoriteListings: React.Dispatch<React.SetStateAction<never[]>>;
};

export default function ListingEntry({ listing, favoriteListings, setFavoriteListings }: ListingEntryProp) {
    const token: Token = cookieHandler.get("token");
    const { user } = useAuth();

    const submitEditFavorites = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const headers: HeaderType = { Authorization: `Token ${token}` };
        const body: FormData = new FormData(e.currentTarget);
        const response: APIResponseType = await apiFns.patch(`favorites/listings/${user?.username}`, body, headers);
        setFavoriteListings(response.data);
    };

    const insertComma = (num: number) => {
        const numString: string = num.toString();
        let numStringWithComma: string = "";
        for (let i = 0; i <= numString.length; i += 1) {
            if (i == 0) {
                numStringWithComma = numString.slice(-1);
            } else if (i % 3 === 0 && numString.length > i && i > 0) {
                numStringWithComma = "," + numString.slice(-i, -i + 1) + numStringWithComma;
            } else {
                numStringWithComma = numString.slice(-i, -i + 1) + numStringWithComma;
            }
        }
        return numStringWithComma;
    };

    return (
        <>
            {listing.is_available ? (
                <>
                    <li key={listing.id} className="listing-entry">
                        {listing.image ? (
                            <div className="listing-image-container">
                                <Link to={`/listings/${listing.id}`}>
                                    <img src={listing.image} alt="" className="listing-image" />
                                </Link>
                            </div>
                        ) : (
                            <figure className="listing-image-container">
                                <Link to={`/listings/${listing.id}`}>
                                    <img
                                        src={"/images/256px-Image_not_available.jpg"}
                                        alt=""
                                        className="listing-image"
                                    />
                                </Link>
                                {/* NOTE: ATTRIBUTION IS DEVELOPMENT ONLY. SHOULD PROVIDE OWN DEFAULT IMAGE ON PRODUCTION. */}
                                <figcaption className="listing-image-figcaption">
                                    Image source:
                                    <a href="https://commons.wikimedia.org/wiki/File:Image_not_available.png">
                                        no-image-available.png
                                    </a>
                                    , <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a>, via
                                    Wikimedia Commons
                                </figcaption>
                            </figure>
                        )}
                        <div className="listing-details-container">
                            <h3 className="listing-title">
                                <Link to={`/listings/${listing.id}`}>{listing.title}</Link>
                            </h3>
                            <div>
                                <b className="listing-listing-type">{listing.listing_type_display}</b>
                            </div>
                            <div>
                                <em className="listing-property-type">({listing.property_type_display})</em>
                            </div>
                            <address>
                                <i className="fa-solid fa-location-dot"></i>{" "}
                                {`${listing.street}, ${listing.baranggay}, ${listing.city}, ${listing.province}`}
                            </address>
                            <div className="listing-info">
                                {listing.bedrooms ? (
                                    <span>
                                        <i className="fa-solid fa-bed"></i> {listing.bedrooms.toString()}
                                    </span>
                                ) : (
                                    <></>
                                )}
                                {listing.bathrooms ? (
                                    <span>
                                        <i className="fa-solid fa-shower"></i> {listing.bathrooms.toString()}
                                    </span>
                                ) : (
                                    <></>
                                )}
                                <span>
                                    <i className="fa-solid fa-expand"></i> {listing.property_size.toString()} sqm
                                </span>
                            </div>
                            <div className="listing-seller-and-price">
                                <div>
                                    <img src={listing.seller.seller_image_url} alt="" />
                                    <Link to={`/listings/${listing.id}`}>
                                        {listing.seller.first_name} {listing.seller.last_name}
                                    </Link>
                                </div>
                                {listing.listing_type === "FR" ? (
                                    <b>Php {insertComma(listing.price)} / mo. </b>
                                ) : (
                                    <b>Php {insertComma(listing.price)} </b>
                                )}
                            </div>
                        </div>

                        {!user ? (
                            <></>
                        ) : favoriteListings.includes(listing.id) ? (
                            <form onSubmit={submitEditFavorites}>
                                <input type="hidden" name="remove_from_favorites" value={listing.id} />
                                <button>Remove from favorites</button>
                            </form>
                        ) : (
                            <form onSubmit={submitEditFavorites}>
                                <input type="hidden" name="add_to_favorites" value={listing.id} />
                                <button>Add to favorites</button>
                            </form>
                        )}
                    </li>
                </>
            ) : (
                <></>
            )}
        </>
    );
}
