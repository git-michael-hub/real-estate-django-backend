import { createContext, useState } from "react";
import { apiFns, APIResponseType, HeaderType } from "../../../utils/api-service";
import cookieHandler, { Token } from "../../../utils/cookie-handler";
import { BaseListingType, ListingType } from "../../../types/types";
import { API_URLS } from "../../../urls/api-urls";

export type PaginatedListingsType = {
    count: number;
    links: {
        next: string | null;
        previous: string | null;
    };
    pages: number;
    results: BaseListingType[];
};

export type ListingFormMessageStateType = {
    success?: string[];
    error?: string[];
    title?: string[];
    listing_type?: string[];
    property_type?: string[];
    price?: string[];
    image1_path?: string[];
    image2_path?: string[];
    image3_path?: string[];
    image4_path?: string[];
    image5_path?: string[];
    lot_area?: string[];
    floor_area?: string[];
    num_of_floors?: string[];
    description?: string[];
    bedrooms?: string[];
    bathrooms?: string[];
    province?: string[];
    city?: string[];
    baranggay?: string[];
    street?: string[];
};

export const API_DIRECTORY_LISTINGS = "api/listings/";

type ChildrenType = { children?: React.ReactElement | React.ReactElement[] };

export const ListingProvider = ({ children }: ChildrenType): React.ReactElement => {
    const [listing, setListing] = useState<ListingType | null>(null);
    const [listings, setListings] = useState<ListingType[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pages, setPages] = useState<number>(1);
    const [nextPageLink, setNextPageLink] = useState<string | null>(null);
    const [previousPageLink, setPreviousPageLink] = useState<string | null>(null);

    // GET 1 SPECIFIC LISTING
    const fetchListing = async (listingId: string | number): Promise<ListingType | null> => {
        const response: APIResponseType = await apiFns.get(API_URLS.LISTING.RETRIEVE(listingId));
        if (response.success) return response.data;
        console.log(response.err_messages);
        return null;
    };

    // GET A LIST OF LISTING BASED ON SEARCH PARAMETERS
    const fetchListings = async (searchParams?: string): Promise<PaginatedListingsType | null> => {
        console.log(API_URLS.LISTING.SEARCH(searchParams));
        const response: APIResponseType = await apiFns.get(API_URLS.LISTING.SEARCH(searchParams));
        if (response.success) return response.data;
        console.log(response.err_messages);
        return null;
    };

    // GET 1 SPECIFIC LISTING AND UPDATE STATE
    const fetchListingAndUpdateState = async (listingId: string | number): Promise<ListingType | null> => {
        const listing: ListingType | null = await fetchListing(listingId);
        setListing(listing);
        return listing;
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

    const deleteListing = async (listingId: number): Promise<boolean> => {
        try {
            const token: Token = cookieHandler.get("token");
            const headers: HeaderType = { Authorization: `Token ${token}` };
            const response: APIResponseType = await apiFns.del(`${API_DIRECTORY_LISTINGS}${listingId}`, headers);
            return response.success;
        } catch (error) {
            return false;
        }
    };

    const editListing = async (formData: FormData, listingId: number): Promise<APIResponseType | null> => {
        try {
            const token: Token = cookieHandler.get("token");
            const headers: HeaderType = { Authorization: `Token ${token}` };
            const response: APIResponseType = await apiFns.patch(
                `${API_DIRECTORY_LISTINGS}${listingId}`,
                formData,
                headers
            );
            return response;
        } catch (error) {
            alert("An error occurred");
            return null;
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
                deleteListing,
                editListing,
                page,
                pages,
                nextPageLink,
                previousPageLink,
                setPage,
                setPages,
                setNextPageLink,
                setPreviousPageLink,
                fetchListingAndUpdateState,
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
    deleteListing: (listingId: number) => Promise<boolean>;
    editListing: (formData: FormData, listingId: number) => Promise<APIResponseType | null>;
    page: number;
    pages: number;
    nextPageLink: string | null;
    previousPageLink: string | null;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setPages: React.Dispatch<React.SetStateAction<number>>;
    setNextPageLink: React.Dispatch<React.SetStateAction<string | null>>;
    setPreviousPageLink: React.Dispatch<React.SetStateAction<string | null>>;
    fetchListingAndUpdateState: (listingId: string) => Promise<ListingType | null>;
    fetchListingsAndUpdateState: (searchParams: string) => Promise<void>;
};

const initListingContextState: ListingContextType = {
    listing: null,
    setListing: () => {},
    listings: [],
    setListings: () => {},
    fetchListing: () => Promise.resolve(null),
    fetchListings: () => Promise.resolve(null),
    deleteListing: () => Promise.resolve(false),
    editListing: () => Promise.resolve(null),
    page: 1,
    pages: 1,
    nextPageLink: null,
    previousPageLink: null,
    setPage: () => {},
    setPages: () => {},
    setNextPageLink: () => {},
    setPreviousPageLink: () => {},
    fetchListingAndUpdateState: () => Promise.resolve(null),
    fetchListingsAndUpdateState: () => Promise.resolve(),
};

const ListingContext = createContext<ListingContextType>(initListingContextState);

export default ListingContext;
