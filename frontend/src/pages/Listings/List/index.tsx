import { useEffect, useState } from "react";
import { apiFns, HeaderType } from "../../../ts/api-service";
import ListingEntry, { ListingType } from "../../../features/listings/components/ListingEntry";
import "./index.css";
import useAuth from "../../../features/auth/hooks/useAuth";
import cookieHandler, { Token } from "../../../ts/cookie-handler";

type ListListingStateType = ListingType[];

export default function List() {
    const [listings, setListings] = useState<ListListingStateType>([]);
    const [favoriteListings, setFavoriteListings] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchListings = async (): Promise<void> => {
            try {
                const response: Response = await apiFns.get(`listings/${window.location.search}`);
                const listings: ListListingStateType = await response.json();
                setListings(listings);
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
                const response: Response = await apiFns.get(`favorites/${user.username}`, headers);
                const favorites: any = await response.json(); // MUST CREATE TYPE FOR FAVORITES
                setFavoriteListings(favorites.listings);
            } catch (error: unknown) {
                console.log(
                    `An error occurred at function ${fetchFavorites.name}() inside pages/Listings/index.tsx. \n${error}`
                );
            }
        };

        fetchFavorites();
        fetchListings();
    }, []);

    return (
        <main>
            <h1>Listings Page</h1>
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
        </main>
    );
}
