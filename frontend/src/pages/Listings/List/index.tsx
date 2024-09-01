import { useEffect, useState } from "react";
import { apiFns } from "../../../ts/api-service";
import ListingEntry, { ListingType } from "../../../features/listings/components/ListingEntry";
import "./index.css";

type ListListingStateType = ListingType[];

export default function List() {
    const [listings, setListings] = useState<ListListingStateType>([]);

    useEffect(() => {
        const fetchListings = async (): Promise<void> => {
            try {
                const response: Response = await apiFns.get(`listings/${window.location.search}`);
                const listings: ListListingStateType = await response.json();
                console.log(listings);
                setListings(listings);
            } catch (error: unknown) {
                console.log(
                    `An error occurred at function ${fetchListings.name}() inside pages/Listings/index.tsx. \n${error}`
                );
            }
        };

        fetchListings();
    }, []);

    return (
        <main>
            <h1>Listings Page</h1>
            <ul>
                {listings.map((listing) => {
                    return <ListingEntry listing={listing} key={listing.id} />;
                })}
            </ul>
        </main>
    );
}
