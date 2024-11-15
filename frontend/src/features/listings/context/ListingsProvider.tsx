import { createContext, useState } from "react";
import { SellerType } from "../../sellers/context/SellersProvider";
import { apiFns, APIResponseType } from "../../../ts/api-service";

export type ListingType = {
    id: number;
    seller: number;
    seller_details: SellerType;
    title: string;
    listing_type: string;
    listing_type_display: string;
    property_type: string;
    property_type_display: string;
    price: number;
    image1?: string;
    image2?: string;
    image3?: string;
    image4?: string;
    image5?: string;
    property_size: number;
    description: string;
    is_available: boolean;
    bedrooms?: number;
    bathrooms?: number;
    province: string;
    city: string;
    baranggay: string;
    street: string;
};

export type PaginatedListingsType = {
    count: number;
    links: {
        next: string | null;
        previous: string | null;
    };
    pages: number;
    results: ListingType[];
};

type ChildrenType = { children?: React.ReactElement | React.ReactElement[] };

export const ListingProvider = ({ children }: ChildrenType): React.ReactElement => {
    const [listing, setListing] = useState<ListingType | null>(null);
    const [listings, setListings] = useState<ListingType[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pages, setPages] = useState<number>(1);
    const [nextPageLink, setNextPageLink] = useState<string | null>(null);
    const [previousPageLink, setPreviousPageLink] = useState<string | null>(null);

    // GET 1 SPECIFIC LISTING
    const fetchListing = async (path: string): Promise<ListingType | null> => {
        try {
            const response: APIResponseType = await apiFns.get(`${path}`);
            if (response.success) return response.data;
            return null;
        } catch {
            return null;
        }
    };

    // GET A LIST OF LISTING BASED ON SEARCH PARAMETERS
    const fetchListings = async (searchParams: string): Promise<PaginatedListingsType | null> => {
        try {
            const response: APIResponseType = await apiFns.get(`listings/${searchParams}`);
            if (response.success) return response.data;
            return null;
        } catch {
            return null;
        }
    };

    // GET A LIST OF LISTING BASED ON SEARCH PARAMETERS AND UPDATE STATE
    const fetchListingsAndUpdateState = async (searchParams: string): Promise<void> => {
        const paginated_listings = await fetchListings(searchParams);
        if (paginated_listings) {
            const urlSearchParams = new URLSearchParams(searchParams);
            const page = urlSearchParams.get("page");
            if (page) setPage(Number(page));
            if (page === null) setPage(1);
            setPages(paginated_listings.pages);
            setListings(paginated_listings.results);
            setNextPageLink(paginated_listings.links.next);
            setPreviousPageLink(paginated_listings.links.previous);
        }
    };

    return (
        <ListingContext.Provider
            value={{
                listing,
                setListing,
                listings,
                setListings,
                fetchListing,
                fetchListings,
                page,
                pages,
                nextPageLink,
                previousPageLink,
                setPage,
                setPages,
                setNextPageLink,
                setPreviousPageLink,
                fetchListingsAndUpdateState,
            }}
        >
            {children}
        </ListingContext.Provider>
    );
};

export type ListingContextType = {
    listing: ListingType | null;
    setListing: React.Dispatch<React.SetStateAction<ListingType | null>>;
    listings: ListingType[];
    setListings: React.Dispatch<React.SetStateAction<ListingType[]>>;
    fetchListing: (path: string) => Promise<ListingType | null>;
    fetchListings: (searchParams: string) => Promise<PaginatedListingsType | null>;
    page: number;
    pages: number;
    nextPageLink: string | null;
    previousPageLink: string | null;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setPages: React.Dispatch<React.SetStateAction<number>>;
    setNextPageLink: React.Dispatch<React.SetStateAction<string | null>>;
    setPreviousPageLink: React.Dispatch<React.SetStateAction<string | null>>;
    fetchListingsAndUpdateState: (searchParams: string) => Promise<void>;
};

const initListingContextState: ListingContextType = {
    listing: null,
    setListing: () => {},
    listings: [],
    setListings: () => {},
    fetchListing: () => Promise.resolve(null),
    fetchListings: () => Promise.resolve(null),
    page: 1,
    pages: 1,
    nextPageLink: null,
    previousPageLink: null,
    setPage: () => {},
    setPages: () => {},
    setNextPageLink: () => {},
    setPreviousPageLink: () => {},
    fetchListingsAndUpdateState: () => Promise.resolve(),
};

const ListingContext = createContext<ListingContextType>(initListingContextState);

export default ListingContext;
