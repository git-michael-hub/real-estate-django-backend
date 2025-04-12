import { createContext, useState } from "react";
import { SellerType } from "../../sellers/context/SellersProvider";
import { apiFns, APIResponseType, HeaderType } from "../../../utils/api-service";
import cookieHandler, { Token } from "../../../utils/cookie-handler";

export type SellerAccountType = {};

export type PropertyType = {
    property_type: "HL" | "CO" | "RL" | "CL";
    property_type_display: string;
    seller_account: SellerAccountType;
    province: string;
    city: string;
    barangay: string;
    street: string;
    lot_area: number | null;
    floor_area: number | null;
    num_of_floors: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    date_created: Date;
    // status:
};

export type AgentAccountType = {};

export type ListingListType = {
    listing_type: "FS" | "FR" | "FC";
    listing_type_display: string;
    property: PropertyType;
    agent_account: AgentAccountType;
};

export type ListingType = {
    id: number;
    seller: number;
    seller_details: SellerType;
    title: string;
    listing_type: "FS" | "FR" | "FC";
    listing_type_display: string;
    property: "HL" | "CO" | "RL" | "CL";
    property_type_display: string;
    price: number;
    image1?: string | File | null;
    image2?: string | File | null;
    image3?: string | File | null;
    image4?: string | File | null;
    image5?: string | File | null;
    status: "A";
    property_size: number;
    description: string;
    is_available: boolean;
    created_at: Date;
    bedrooms?: number;
    bathrooms?: number;
    province: string;
    city: string;
    baranggay: string;
    street: string;
    DELETED?: boolean;
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

export type ListingFormMessageStateType = {
    success?: string[];
    error?: string[];
    title?: string[];
    listing_type?: string[];
    property_type?: string[];
    price?: string[];
    image1?: string[];
    image2?: string[];
    image3?: string[];
    image4?: string[];
    image5?: string[];
    property_size?: string[];
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
    const [listing, setListing] = useState<ListingType | Partial<ListingType> | null>(null);
    const [listings, setListings] = useState<ListingType[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pages, setPages] = useState<number>(1);
    const [nextPageLink, setNextPageLink] = useState<string | null>(null);
    const [previousPageLink, setPreviousPageLink] = useState<string | null>(null);

    // GET 1 SPECIFIC LISTING
    const fetchListing = async (listingId: string | number): Promise<ListingType | null> => {
        try {
            const response: APIResponseType = await apiFns.get(`${API_DIRECTORY_LISTINGS}${listingId}`);

            if (response.success) return response.data;
            return null;
        } catch {
            return null;
        }
    };

    // GET A LIST OF LISTING BASED ON SEARCH PARAMETERS
    const fetchListings = async (searchParams: string): Promise<PaginatedListingsType | null> => {
        try {
            const token: Token = cookieHandler.get("token");
            let response: APIResponseType | undefined;
            if (token) {
                const headers: HeaderType = { Authorization: `Token ${token}` };
                response = await apiFns.get(`${API_DIRECTORY_LISTINGS}${searchParams}`, headers);
            } else {
                response = await apiFns.get(`${API_DIRECTORY_LISTINGS}${searchParams}`);
            }

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
                fetchListingsAndUpdateState,
            }}
        >
            {children}
        </ListingContext.Provider>
    );
};

export type ListingContextType = {
    listing: ListingType | Partial<ListingType> | null;
    setListing: React.Dispatch<React.SetStateAction<ListingType | Partial<ListingType> | null>>;
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
    fetchListingsAndUpdateState: () => Promise.resolve(),
};

const ListingContext = createContext<ListingContextType>(initListingContextState);

export default ListingContext;
