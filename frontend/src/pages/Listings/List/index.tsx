import { useEffect, useState } from "react";
import { apiFns, APIResponseType, HeaderType } from "../../../ts/api-service";
import cookieHandler, { Token } from "../../../ts/cookie-handler";
import useAuth from "../../../features/auth/hooks/useAuth";
import useListing from "../../../features/listings/hooks/useListings";
import ListingEntry from "../components/ListingEntry";
import ListingSearchForm from "../components/ListingSearchForm";
import PageBtns from "../../../components/PageBtns";
import "./index.css";

export default function List() {
    const [favoriteListings, setFavoriteListings] = useState([]);
    const { user } = useAuth();
    const { listings, page, pages, nextPageLink, previousPageLink, fetchListingsAndUpdateState } = useListing();

    useEffect(() => {
        const initListings = async (): Promise<void> => {
            await fetchListingsAndUpdateState(window.location.search);
        };

        const initFavorites = async (): Promise<void> => {
            const token: Token = cookieHandler.get("token");
            if (!token || !user) return;

            try {
                const headers: HeaderType = { Authorization: `Token ${token}` };
                const response: APIResponseType = await apiFns.get(`favorites/listings/${user.username}`, headers);
                const favorites: any = response; // MUST CREATE TYPE FOR FAVORITES
                setFavoriteListings(favorites.listings);
            } catch (error: unknown) {
                console.log(
                    `An error occurred at function ${initFavorites.name}() inside pages/Listings/index.tsx. \n${error}`
                );
            }
        };

        initFavorites();
        initListings();
    }, []);

    return (
        <main id="listings-page">
            <div id="listing-grid-container">
                <header>
                    <h2>Listings</h2>
                    <hr />
                </header>
                <section>
                    <ListingSearchForm></ListingSearchForm>
                </section>
                <div>
                    {listings.length > 0 ? (
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
                    ) : (
                        <p>No listings found.</p>
                    )}
                    <PageBtns
                        page={page}
                        pages={pages}
                        nextPageLink={nextPageLink}
                        previousPageLink={previousPageLink}
                        action={fetchListingsAndUpdateState}
                        enableNavigate={true}
                    ></PageBtns>
                </div>
            </div>
        </main>
    );
}
