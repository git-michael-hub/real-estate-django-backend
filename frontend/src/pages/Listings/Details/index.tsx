import { useEffect, useState } from "react";
import helperFn from "../../../ts/helper";
import { ListingType } from "../../../features/listings/context/ListingsProvider";
import ContactForm from "../components/ContactForm";
import Tag from "../../../components/Tag";
import useListing from "../../../features/listings/hooks/useListings";
import { SellerDetailsType, SellerType } from "../../../features/sellers/context/SellersProvider";
import useAuth from "../../../features/auth/hooks/useAuth";
import useBuyer from "../../../features/buyers/hooks/useBuyers";
import BtnIconNoBg from "../../../components/Buttons/BtnIconNoBg";
import "./index.css";
import NotFound from "../../NotFound";

export default function Details() {
    const [displayImage, setDisplayImage] = useState<string | null>(null);
    const { listing, setListing, fetchListing } = useListing();
    const { user } = useAuth();
    const { favoriteListings, editFavorites } = useBuyer();

    useEffect(() => {
        const initState = async () => {
            const listing_id = window.location.pathname.slice(10);
            const listing: ListingType | null = await fetchListing(listing_id);
            setListing(listing);
            if (listing?.image1) setDisplayImage(listing.image1 as string);
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
                                <Tag className="tag-2">{listing.property_type_display}</Tag>
                            </div>
                            <address>
                                <i className="fa-solid fa-location-dot"></i>{" "}
                                {`${listing.street}, ${listing.baranggay}, ${listing.city}, ${listing.province}`}
                            </address>
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
                                {listing.image1 ? <img src={listing.image1 as string} onClick={onClickImage} /> : <></>}
                                {listing.image2 ? <img src={listing.image2 as string} onClick={onClickImage} /> : <></>}
                                {listing.image3 ? <img src={listing.image3 as string} onClick={onClickImage} /> : <></>}
                                {listing.image4 ? <img src={listing.image4 as string} onClick={onClickImage} /> : <></>}
                                {listing.image5 ? <img src={listing.image5 as string} onClick={onClickImage} /> : <></>}
                            </div>

                            <div>
                                <span>
                                    <h3>Overview</h3>
                                </span>
                                <div className="listing-info">
                                    <span>
                                        <i className="fa-solid fa-expand"></i> {listing.property_size?.toString()} sqm
                                    </span>
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
                            <ContactForm
                                listing={listing as ListingType}
                                seller={listing.seller_details as SellerType | SellerDetailsType}
                            ></ContactForm>
                        </section>
                    </>
                ) : (
                    <NotFound></NotFound>
                )}
            </div>
        </main>
    );
}
