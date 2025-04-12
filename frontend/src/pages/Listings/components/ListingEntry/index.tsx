import { Link } from "react-router-dom";
import useAuth from "../../../../features/auth/hooks/useAuth";
import helperFn from "../../../../utils/form-functions";
import { ListingType } from "../../../../features/listings/context/ListingsProvider";
import BtnIconNoBg from "../../../../components/Buttons/BtnIconNoBg";
import "./index.css";
import useBuyer from "../../../../features/buyers/hooks/useBuyers";

type ListingEntryPropType = {
    listing: ListingType;
};

export default function ListingEntry({ listing }: ListingEntryPropType) {
    const { user } = useAuth();
    const { favoriteListings, editFavorites } = useBuyer();

    console.log(listing.status);

    return (
        <>
            {listing.status === "A" ? (
                <>
                    <li key={listing.id} className="listing-entry">
                        {listing.image1 ? (
                            <div className="listing-image-container">
                                <Link to={`/listings/${listing.id}`}>
                                    <img src={listing.image1 as string} alt="" className="listing-image" />
                                </Link>
                            </div>
                        ) : (
                            <figure className="listing-image-container">
                                <Link to={`/listings/${listing.id}`}>
                                    <img
                                        src="/static/images/256px-Image_not_available.png"
                                        alt=""
                                        className="listing-image"
                                    />
                                </Link>
                                {/* NOTE: ATTRIBUTION IS DEVELOPMENT ONLY. SHOULD PROVIDE OWN DEFAULT IMAGE ON PRODUCTION. */}
                                <figcaption className="listing-image-figcaption">
                                    Image source:{" "}
                                    <a href="https://commons.wikimedia.org/wiki/File:Image_not_available.png">
                                        no-image-available.png
                                    </a>
                                    , <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a>, via
                                    Wikimedia Commons
                                </figcaption>
                            </figure>
                        )}
                        <div className="listing-details-container">
                            <header>
                                <h3 className="listing-title">
                                    <Link to={`/listings/${listing.id}`}>{listing.title}</Link>
                                </h3>
                                {!user ? (
                                    <></>
                                ) : favoriteListings.includes(listing.id) ? (
                                    <form onSubmit={(e) => editFavorites(e, user.username)}>
                                        <input type="hidden" name="remove_from_favorites" value={listing.id} />
                                        <BtnIconNoBg>
                                            <i className="fa-solid fa-heart favorite"></i>
                                        </BtnIconNoBg>
                                    </form>
                                ) : (
                                    <form onSubmit={(e) => editFavorites(e, user.username)}>
                                        <input type="hidden" name="add_to_favorites" value={listing.id} />
                                        <BtnIconNoBg>
                                            <i className="fa-regular fa-heart"></i>
                                        </BtnIconNoBg>
                                    </form>
                                )}
                            </header>
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
                                    <img src={listing.seller_details.seller_image_url} alt="" />
                                    <Link to={`/agents/@${listing.seller_details.username}`}>
                                        {listing.seller_details.first_name} {listing.seller_details.last_name}
                                    </Link>
                                </div>
                                {listing.listing_type === "FR" ? (
                                    <b>Php {helperFn.insertComma(listing.price)} / mo. </b>
                                ) : (
                                    <b>Php {helperFn.insertComma(listing.price)} </b>
                                )}
                            </div>
                        </div>
                    </li>
                </>
            ) : (
                <></>
            )}
        </>
    );
}
