import { useEffect, useState } from "react";
import ContactForm from "../../../features/listings/components/ContactForm";
import "./index.css";
import { apiFns, APIResponseType } from "../../../ts/api-service";
import ListingEntry from "../../../features/listings/components/ListingEntry";
import { SellerDetailsType } from "../../../features/sellers/context/SellersProvider";
import BtnBasic from "../../../components/Buttons/BtnBasic";
import useListing from "../../../features/listings/hooks/useListings";
import PageBtns from "../../../components/PageBtns";

export default function Profile() {
    const [seller, setSeller] = useState<SellerDetailsType>();
    const [favoriteListings, setFavoriteListings] = useState([]);
    const { listings, previousPageLink, nextPageLink, page, pages, fetchListingsAndUpdateState } = useListing();

    useEffect(() => {
        const username = window.location.pathname.slice(9);

        const fetchSeller = async () => {
            const response: APIResponseType = await apiFns.get(`sellers/${username}`);
            const seller: SellerDetailsType = response.data;
            setSeller(seller);
        };

        const fetchListings = async () => {
            await fetchListingsAndUpdateState(`?username=${username}`);
        };

        fetchSeller();
        fetchListings();
    }, []);

    return (
        <main id="seller-profile-page">
            {seller ? (
                <div id="seller-profile-grid-container">
                    <div>
                        <section id="seller-profile-details-container">
                            <img src={seller.seller_image_url} alt="" />
                            <div>
                                <h2>
                                    {seller.first_name} {seller.last_name}
                                </h2>
                                <em>@{seller.username}</em>
                                <span>
                                    <i className="fa-solid fa-phone"></i> {seller.contact_number_1}
                                </span>
                                <hr />
                                {seller.contact_number_2 ? (
                                    <>
                                        <span>
                                            <i className="fa-solid fa-phone"></i> {seller.contact_number_2}
                                        </span>
                                        <hr />
                                    </>
                                ) : (
                                    <></>
                                )}
                                <span title={seller.email}>
                                    <i className="fa-solid fa-envelope"></i> {seller.email}
                                </span>
                                <p>{seller.bio}</p>
                            </div>
                        </section>
                        <div id="seller-profile-btn-container">
                            <BtnBasic>
                                <span>Listings</span>
                            </BtnBasic>
                        </div>
                        {listings ? (
                            <>
                                <ul>
                                    {listings.map((listing) => {
                                        return (
                                            <ListingEntry
                                                listing={listing}
                                                key={listing.id}
                                                favoriteListings={favoriteListings}
                                                setFavoriteListings={setFavoriteListings}
                                            />
                                        );
                                    })}
                                </ul>
                                <PageBtns
                                    page={page}
                                    pages={pages}
                                    previousPageLink={previousPageLink}
                                    nextPageLink={nextPageLink}
                                    action={fetchListingsAndUpdateState}
                                ></PageBtns>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div>
                        <ContactForm seller={seller}></ContactForm>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </main>
    );
}
