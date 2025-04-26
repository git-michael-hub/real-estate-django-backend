import { useEffect, useState } from "react";
import useListing from "../../../features/listings/hooks/useListings";
import useAuth from "../../../features/auth/hooks/useAuth";
import useBuyer from "../../../features/buyers/hooks/useBuyers";
import { ListingType } from "../../../types/types";
import helperFn from "../../../utils/form-functions";
import NotFound from "../../NotFound";
import BtnIconNoBg from "../../../components/Buttons/BtnIconNoBg";
import ContactForm from "../components/ContactForm";
import Tag from "../../../components/Tag";
import "./index.css";

export default function Details() {
    const [displayImage, setDisplayImage] = useState<string | null>(null);
    const { listing, setListing, fetchListing } = useListing();
    const { user } = useAuth();
    const { wishlistIds, fetchWishlist, addToWishlist, removeFromWishlist } = useBuyer();

    useEffect(() => {
        const initState = async () => {
            const listing_id = window.location.pathname.slice(10);
            const listing: ListingType | null = await fetchListing(listing_id);
            setListing(listing);
            if (listing?.property.image1_path) setDisplayImage(listing.property.image1_path);
            if (user) await fetchWishlist(user.username);
        };
        initState();
    }, []);

    function onClickImage(e: React.MouseEvent<HTMLImageElement>) {
        e.preventDefault();
        setDisplayImage(e.currentTarget.src);
    }

    return (
        <main id="details-page">
            <div id="details-grid-container">
                {listing ? (
                    <>
                        <header>
                            <h2>{listing.title}</h2>
                            <div>
                                <b>
                                    Php {helperFn.insertComma(listing.price as number)}{" "}
                                    {listing.listing_type === "FR" ? <>/ mo.</> : <></>}
                                </b>{" "}
                                <Tag className="tag-1">{listing.listing_type_display}</Tag>{" "}
                                <Tag className="tag-2">{listing.property.property_type_display}</Tag>
                            </div>
                            <address>
                                <i className="fa-solid fa-location-dot"></i>{" "}
                                {`${listing.property.street}, ${listing.property.barangay}, ${listing.property.city}, ${listing.property.province}`}
                            </address>
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
                        <div className="listing-details">
                            {displayImage ? (
                                <img src={displayImage} alt="" className="listing-image" />
                            ) : (
                                <figure>
                                    <img
                                        src="/static/images/256px-Image_not_available.png"
                                        alt=""
                                        className="listing-image"
                                    />
                                    {/* NOTE: ATTRIBUTION IS DEVELOPMENT ONLY. SHOULD PROVIDE OWN DEFAULT IMAGE ON PRODUCTION. */}
                                    <figcaption className="listing-image-figcaption">
                                        Image by{" "}
                                        <a
                                            target="_blank"
                                            rel="noopener"
                                            href="https://www.freepik.com/free-photo/house-with-yard-sign-sale_25625077.htm#fromView=search&page=1&position=2&uuid=c32d462e-2f45-43ad-887d-8f8818355d1b"
                                        >
                                            Freepik
                                        </a>
                                    </figcaption>
                                </figure>
                            )}

                            <div className="listing-image-list">
                                {listing.property.image1_path ? (
                                    <img src={listing.property.image1_path} onClick={onClickImage} />
                                ) : (
                                    <></>
                                )}
                                {listing.property.image2_path ? (
                                    <img src={listing.property.image2_path} onClick={onClickImage} />
                                ) : (
                                    <></>
                                )}
                                {listing.property.image3_path ? (
                                    <img src={listing.property.image3_path} onClick={onClickImage} />
                                ) : (
                                    <></>
                                )}
                                {listing.property.image4_path ? (
                                    <img src={listing.property.image4_path} onClick={onClickImage} />
                                ) : (
                                    <></>
                                )}
                                {listing.property.image5_path ? (
                                    <img src={listing.property.image5_path} onClick={onClickImage} />
                                ) : (
                                    <></>
                                )}
                            </div>

                            <div>
                                <span>
                                    <h3>Overview</h3>
                                </span>
                                <div className="listing-info">
                                    {listing.property.lot_area ? (
                                        <span>
                                            <i className="fa-solid fa-expand"></i>{" "}
                                            {listing.property.lot_area?.toString()} sqm
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                    {listing.property.floor_area ? (
                                        <span>
                                            <i className="fa-solid fa-expand"></i>{" "}
                                            {listing.property.floor_area?.toString()} sqm
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                    {listing.property.num_of_floors ? (
                                        <span>
                                            <i className="fa-solid fa-expand"></i>{" "}
                                            {listing.property.num_of_floors?.toString()} sqm
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                    {listing.property.bedrooms ? (
                                        <span>
                                            <i className="fa-solid fa-bed"></i> {listing.property.bedrooms.toString()}
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                    {listing.property.bathrooms ? (
                                        <span>
                                            <i className="fa-solid fa-shower"></i>{" "}
                                            {listing.property.bathrooms.toString()}
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>

                            {listing.description ? (
                                <div className="listing-description">
                                    <h3>
                                        <span>Description</span>
                                    </h3>
                                    <p>{listing.description}</p>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                        <section>
                            {listing.agent_account ? (
                                <ContactForm
                                    listing={listing}
                                    agent_username={listing.agent_account.user.username}
                                ></ContactForm>
                            ) : (
                                <ContactForm
                                    listing={listing}
                                    seller_username={listing.property.seller_account.user.username}
                                ></ContactForm>
                            )}
                        </section>
                    </>
                ) : (
                    <NotFound></NotFound>
                )}
            </div>
        </main>
    );
}
