import { useEffect, useState } from "react";
import { apiFns } from "../../../ts/api-service";
import { ListingType } from "../../../features/listings/components/ListingEntry";
import { UserType } from "../../../features/auth/context/AuthProvider";
import "./index.css";

type DetailsListingStateType = (Omit<ListingType, "owner"> & { owner: UserType }) | null;

export default function Details() {
    const [listing, setListing] = useState<DetailsListingStateType>(null);

    useEffect(() => {
        const fetchListing = async () => {
            const response: Response = await apiFns.get(`${window.location.pathname}`);
            const listing: DetailsListingStateType = await response.json();
            if (response.ok) {
                setListing(listing);
            } else {
                setListing(null);
            }
            console.log(listing);
        };
        fetchListing();
    }, []);

    return (
        <main id="details-page">
            <h1>Details</h1>
            {listing ? (
                <div>
                    <h2>{listing.title}</h2>
                    <b>{listing.property_type_display}</b>
                    <br />
                    <em>({listing.listing_type_display})</em>
                    <br />
                    <address>
                        Location: {`${listing.street}, ${listing.baranggay}, ${listing.city}, ${listing.province}`}
                    </address>
                    <span>Price: Php {listing.price.toString()}</span>

                    <br />
                    {listing.image ? (
                        <img src={listing.image} alt="" className="listing-image" />
                    ) : (
                        <figure>
                            <img src={"/images/default_house_for_sale.jpg"} alt="" className="listing-image" />
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

                    <br />
                    <span>Area: {listing.property_size.toString()} sqm</span>
                    <br />
                    {listing.bedrooms ? (
                        <>
                            <span>Bedrooms: {listing.bedrooms.toString()}</span> <br />
                        </>
                    ) : (
                        <></>
                    )}

                    {listing.bathrooms ? (
                        <>
                            <span>Bathrooms: {listing.bathrooms.toString()}</span>
                            <br />
                        </>
                    ) : (
                        <></>
                    )}
                    {listing.description ? <p className="listing-description">{listing.description}</p> : <></>}
                </div>
            ) : (
                <div>Listing does not exist.</div>
            )}
        </main>
    );
}
