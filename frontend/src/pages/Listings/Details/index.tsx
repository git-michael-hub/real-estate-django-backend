import { useEffect } from "react";
import helperFn from "../../../ts/helper";
import { ListingType } from "../../../features/listings/context/ListingsProvider";
import ContactForm from "../../../features/listings/components/ContactForm";
import BtnIcon from "../../../components/Buttons/BtnIcon";
import BtnIconActive from "../../../components/Buttons/BtnIconActive";
import Tag from "../../../components/Tag";
import "./index.css";
import useListing from "../../../features/listings/hooks/useListings";

export default function Details() {
    const { listing, setListing, fetchListing } = useListing();

    useEffect(() => {
        const initState = async () => {
            const listing: ListingType | null = await fetchListing(window.location.pathname);
            setListing(listing);
        };
        initState();
    }, []);

    return (
        <main id="details-page">
            <div id="details-grid-container">
                {listing ? (
                    <>
                        <header>
                            <h2>{listing.title}</h2>
                            <div>
                                <b>
                                    Php {helperFn.insertComma(listing.price)}{" "}
                                    {listing.listing_type === "FR" ? <>/ mo.</> : <></>}
                                </b>{" "}
                                <Tag className="tag-1">{listing.listing_type_display}</Tag>{" "}
                                <Tag className="tag-2">{listing.property_type_display}</Tag>
                            </div>
                            <address>
                                <i className="fa-solid fa-location-dot"></i>{" "}
                                {`${listing.street}, ${listing.baranggay}, ${listing.city}, ${listing.province}`}
                            </address>
                            {true ? (
                                <BtnIcon title="Add to favorites">
                                    <i className="fa-regular fa-star"></i>
                                </BtnIcon>
                            ) : (
                                <BtnIconActive title="Add to favorites">
                                    <i className="fa-regular fa-star"></i>
                                </BtnIconActive>
                            )}
                        </header>
                        <div className="listing-details">
                            {listing.image ? (
                                <img src={listing.image} alt="" className="listing-image" />
                            ) : (
                                <figure>
                                    <img
                                        src={"/images/256px-Image_not_available.png"}
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
                                <img src={listing.image} alt="" />
                                <img src={listing.image} alt="" />
                                <img src={listing.image} alt="" />
                                <img src={listing.image} alt="" />
                                <img src={listing.image} alt="" />
                            </div>

                            <div>
                                <h3>Overview</h3>

                                <div className="listing-info">
                                    <span>
                                        <i className="fa-solid fa-expand"></i> {listing.property_size.toString()} sqm
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
                                    <h3>Description</h3>
                                    <p>{listing.description}</p>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                        <section>
                            <ContactForm listing={listing} seller={listing.seller}></ContactForm>
                        </section>
                    </>
                ) : (
                    <div>Listing does not exist.</div>
                )}
            </div>
        </main>
    );
}
