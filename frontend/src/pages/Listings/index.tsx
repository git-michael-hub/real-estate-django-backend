import { useEffect, useState } from "react";
import { apiFns } from "../../ts/api-service";
import "./index.css";
import ListingEntry, { ListingType } from "../../features/listings/components/ListingEntry";

type ListingsType = ListingType[];

export default function Listings() {
    const [listings, setListings] = useState<ListingsType>([]);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response: Response = await apiFns.get(window.location.pathname + window.location.search);
                const listings = await response.json();
                console.log(listings);
                setListings(listings);
            } catch (error) {
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
                    return <ListingEntry listing={listing} key={listing.pk} />;
                })}
            </ul>
        </main>
    );
}
