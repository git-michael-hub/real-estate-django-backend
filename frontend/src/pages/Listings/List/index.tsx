import { useEffect, useState } from "react";
import { apiFns, APIResponseType, HeaderType } from "../../../ts/api-service";
import ListingEntry, { ListingType } from "../../../features/listings/components/ListingEntry";
import "./index.css";
import useAuth from "../../../features/auth/hooks/useAuth";
import cookieHandler, { Token } from "../../../ts/cookie-handler";
import ListingSearchForm from "../../../features/listings/components/ListingSearchForm";

type ListListingStateType = ListingType[];

export default function List() {
    const [searchForm, setSearchForm] = useState<FormData>(new FormData());
    const [listings, setListings] = useState<ListListingStateType>([]);
    const [favoriteListings, setFavoriteListings] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchListings = async (): Promise<void> => {
            try {
                const response: APIResponseType = await apiFns.get(`listings/${window.location.search}`);
                const listings: ListListingStateType = response.data;
                setListings(listings);
                console.log(listings);
            } catch (error: unknown) {
                console.log(
                    `An error occurred at function ${fetchListings.name}() inside pages/Listings/index.tsx. \n${error}`
                );
            }
        };

        const fetchFavorites = async (): Promise<void> => {
            const token: Token = cookieHandler.get("token");
            if (!token || !user) return;

            try {
                const headers: HeaderType = { Authorization: `Token ${token}` };
                const response: APIResponseType = await apiFns.get(`favorites/listings/${user.username}`, headers);
                const favorites: any = response; // MUST CREATE TYPE FOR FAVORITES
                setFavoriteListings(favorites.listings);
            } catch (error: unknown) {
                console.log(
                    `An error occurred at function ${fetchFavorites.name}() inside pages/Listings/index.tsx. \n${error}`
                );
            }
        };

        fetchFavorites();
        fetchListings();
    }, [searchForm]);

    return (
        <main id="listings-page">
            <div id="listing-grid-container">
                <div>
                    <h2>Listings</h2>
                    <hr />
                </div>
                <section>
                    <ListingSearchForm setSearchForm={setSearchForm}></ListingSearchForm>
                </section>
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
            </div>
        </main>
    );
}
