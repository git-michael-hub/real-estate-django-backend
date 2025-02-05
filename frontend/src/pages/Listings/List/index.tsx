import { useEffect } from "react";
import useAuth from "../../../features/auth/hooks/useAuth";
import useListing from "../../../features/listings/hooks/useListings";
import useBuyer from "../../../features/buyers/hooks/useBuyers";
import ListingEntry from "../components/ListingEntry";
import ListingSearchForm from "../components/ListingSearchForm";
import PageBtns from "../../../components/PageBtns";
import "./index.css";

export default function List() {
    const { user } = useAuth();
    const { listings, page, pages, nextPageLink, previousPageLink, fetchListingsAndUpdateState } = useListing();
    const { fetchFavoriteListings } = useBuyer();

    useEffect(() => {
        const init = async (): Promise<void> => {
            await fetchListingsAndUpdateState(window.location.search);
            if (user) await fetchFavoriteListings(user.username);
        };
        init();
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
                                return <ListingEntry listing={listing} key={listing.id} />;
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
