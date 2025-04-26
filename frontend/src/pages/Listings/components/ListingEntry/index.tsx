import { Link } from "react-router-dom";
import useAuth from "../../../../features/auth/hooks/useAuth";
import useBuyer from "../../../../features/buyers/hooks/useBuyers";
import { BaseListingType } from "../../../../types/types";
import helperFn from "../../../../utils/form-functions";
import BtnIconNoBg from "../../../../components/Buttons/BtnIconNoBg";
import "./index.css";

export default function ListingEntry({ listing }: { listing: BaseListingType }) {
    const { user } = useAuth();
    const { wishlistIds, addToWishlist, removeFromWishlist } = useBuyer();

    return (
        <>
            {listing.status === "A" ? (
                <>
                    <li key={listing.id} className="listing-entry">
                        {listing.property.image1_path ? (
                            <div className="listing-image-container">
                                <Link to={`/listings/${listing.id}`}>
                                    <img src={listing.property.image1_path} alt="" className="listing-image" />
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
                                ) : wishlistIds.includes(listing.id) ? (
                                    <form
                                        onSubmit={(e) => {
                                            removeFromWishlist(e, user.username, listing.id);
                                        }}
                                    >
                                        <BtnIconNoBg>
                                            <i className="fa-solid fa-heart favorite"></i>
                                        </BtnIconNoBg>
                                    </form>
                                ) : (
                                    <form
                                        onSubmit={(e) => {
                                            addToWishlist(e, user.username, listing.id);
                                        }}
                                    >
                                        <input type="hidden" name="listing" value={listing.id} />
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
                                <em className="listing-property-type">({listing.property.property_type_display})</em>
                            </div>
                            <address>
                                <i className="fa-solid fa-location-dot"></i>{" "}
                                {`${listing.property.street}, ${listing.property.barangay}, ${listing.property.city}, ${listing.property.province}`}
                            </address>
                            <div className="listing-info">
                                {listing.property.bedrooms ? (
                                    <span>
                                        <i className="fa-solid fa-bed"></i> {listing.property.bedrooms.toString()}
                                    </span>
                                ) : (
                                    <></>
                                )}
                                {listing.property.bathrooms ? (
                                    <span>
                                        <i className="fa-solid fa-shower"></i> {listing.property.bathrooms.toString()}
                                    </span>
                                ) : (
                                    <></>
                                )}
                                <span>
                                    <i className="fa-solid fa-expand"></i> {listing.property.lot_area?.toString()} sqm
                                </span>
                            </div>
                            <div className="listing-seller-and-price">
                                {listing.agent_account ? (
                                    <div>
                                        <img src={listing.agent_account.profile_image_path} alt="" />
                                        <Link to={`/agents/@${listing.agent_account.user.username}`}>
                                            {listing.agent_account.agent_name}
                                        </Link>
                                    </div>
                                ) : (
                                    <></>
                                )}
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
