import { createContext, useState } from "react";
import { apiFns, APIResponseType } from "../../../utils/api-service";
import { ListingType } from "../../../types/listing";
import { API_URLS } from "../../../urls/api-urls";
import { authFns } from "../../../utils/auth-utils";
import { PaginatedListingsType } from "../../../types/listing";

type ChildrenType = { children?: React.ReactElement | React.ReactElement[] };

export const ListingProvider = ({ children }: ChildrenType): React.ReactElement => {
    const [listing, setListing] = useState<ListingType | null>(null);
    const [listings, setListings] = useState<ListingType[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pages, setPages] = useState<number>(1);
    const [nextPageLink, setNextPageLink] = useState<string | null>(null);
    const [previousPageLink, setPreviousPageLink] = useState<string | null>(null);

    // GET 1 SPECIFIC LISTING
    const _mainGetOneListing = async (url: string): Promise<ListingType | null> => {
        const response: APIResponseType = await apiFns.get(url, authFns.createAuthorizationHeader());
        if (response.success) return response.data;
        console.log(response.err_messages);
        return null;
    };

    // GET 1 SPECIFIC LISTING AND UPDATE STATE
    const _mainGetOneListingAndUpdateState = async (url: string): Promise<ListingType | null> => {
        const listing: ListingType | null = await _mainGetOneListing(url);
        setListing(listing);
        return listing;
    };

    // GET A LIST OF LISTING BASED ON SEARCH PARAMETERS
    const _mainGetListings = async (url: string): Promise<PaginatedListingsType | null> => {
        const response: APIResponseType = await apiFns.get(url, authFns.createAuthorizationHeader());
        if (response.success) return response.data;
        console.log(response.err_messages);
        return null;
    };

    // GET A LIST OF LISTING BASED ON SEARCH PARAMETERS AND UPDATE STATE
    const _mainGetListingsAndUpdateState = async (url: string): Promise<PaginatedListingsType | null> => {
        const paginated_listings = await _mainGetListings(url);
        if (paginated_listings) {
            const urlSearchParams = new URLSearchParams(url);
            const page = urlSearchParams.get("page");
            if (page) setPage(Number(page));
            if (page === null) setPage(1);
            setPages(paginated_listings.pages);
            setListings(paginated_listings.results);
            setNextPageLink(paginated_listings.links.next);
            setPreviousPageLink(paginated_listings.links.previous);
        }
        return paginated_listings;
    };

    const _mainCreateListing = async (formData: FormData, url: string): Promise<APIResponseType> => {
        const response: APIResponseType = await apiFns.post(url, formData, authFns.createAuthorizationHeader());
        if (!response.success) console.log(response.err_messages);
        return response;
    };

    const _mainEditListing = async (formData: FormData, url: string): Promise<APIResponseType> => {
        const response: APIResponseType = await apiFns.patch(url, formData, authFns.createAuthorizationHeader());
        if (!response.success) console.log(response.err_messages);
        return response;
    };

    const _mainDeleteListing = async (url: string): Promise<boolean> => {
        const response: APIResponseType = await apiFns.del(url, authFns.createAuthorizationHeader());
        if (!response.success) console.log(response.err_messages);
        return response.success;
    };

    const getOneListing = async (
        listingId: string | number,
        updateState: boolean = true
    ): Promise<ListingType | null> => {
        if (updateState) return await _mainGetOneListingAndUpdateState(API_URLS.LISTING.RETRIEVE(listingId));
        return await _mainGetOneListing(API_URLS.LISTING.RETRIEVE(listingId));
    };

    const getOneListingForSeller = async (
        listingId: string | number,
        updateState: boolean = true
    ): Promise<ListingType | null> => {
        if (updateState) return await _mainGetOneListingAndUpdateState(API_URLS.LISTING.RETRIEVE_FOR_SELLER(listingId));
        return await _mainGetOneListing(API_URLS.LISTING.RETRIEVE_FOR_SELLER(listingId));
    };

    const getOneListingForAgent = async (
        listingId: string | number,
        updateState: boolean = true
    ): Promise<ListingType | null> => {
        if (updateState) return await _mainGetOneListingAndUpdateState(API_URLS.LISTING.RETRIEVE_FOR_AGENT(listingId));
        return await _mainGetOneListing(API_URLS.LISTING.RETRIEVE_FOR_AGENT(listingId));
    };

    const getListings = async (
        searchParams?: string,
        updateState: boolean = true
    ): Promise<PaginatedListingsType | null> => {
        if (updateState) return await _mainGetListingsAndUpdateState(API_URLS.LISTING.LIST(searchParams));
        return await _mainGetListings(API_URLS.LISTING.LIST(searchParams));
    };

    const getListingsForSeller = async (
        searchParams?: string,
        updateState: boolean = true
    ): Promise<PaginatedListingsType | null> => {
        if (updateState) return await _mainGetListingsAndUpdateState(API_URLS.LISTING.LIST_FOR_SELLER(searchParams));
        return await _mainGetListings(API_URLS.LISTING.LIST_FOR_SELLER(searchParams));
    };

    const getListingsForAgent = async (
        searchParams?: string,
        updateState: boolean = true
    ): Promise<PaginatedListingsType | null> => {
        if (updateState) return await _mainGetListingsAndUpdateState(API_URLS.LISTING.LIST_FOR_AGENT(searchParams));
        return await _mainGetListings(API_URLS.LISTING.LIST_FOR_AGENT(searchParams));
    };

    const createListingForSeller = async (formData: FormData): Promise<APIResponseType> => {
        return await _mainCreateListing(formData, API_URLS.LISTING.CREATE_FOR_SELLER());
    };

    const createListingForAgent = async (formData: FormData): Promise<APIResponseType> => {
        return await _mainCreateListing(formData, API_URLS.LISTING.CREATE_FOR_AGENT());
    };

    const editListingForSeller = async (formData: FormData, listingId: number): Promise<APIResponseType> => {
        return await _mainEditListing(formData, API_URLS.LISTING.EDIT_FOR_SELLER(listingId));
    };

    const editListingForAgent = async (formData: FormData, listingId: number): Promise<APIResponseType> => {
        return await _mainEditListing(formData, API_URLS.LISTING.EDIT_FOR_AGENT(listingId));
    };

    const deleteListingForSeller = async (listingId: number | string): Promise<boolean> => {
        return await _mainDeleteListing(API_URLS.LISTING.DELETE_FOR_SELLER(listingId));
    };

    const deleteListingForAgent = async (listingId: number | string): Promise<boolean> => {
        return await _mainDeleteListing(API_URLS.LISTING.DELETE_FOR_AGENT(listingId));
    };

    return (
        <ListingContext.Provider
            value={{
                listing,
                listings,
                page,
                pages,
                nextPageLink,
                previousPageLink,
                setListing,
                setListings,
                setPage,
                setPages,
                setNextPageLink,
                setPreviousPageLink,
                getOneListing,
                getOneListingForSeller,
                getOneListingForAgent,
                getListings,
                getListingsForSeller,
                getListingsForAgent,
                createListingForSeller,
                createListingForAgent,
                deleteListingForSeller,
                deleteListingForAgent,
                editListingForSeller,
                editListingForAgent,
            }}
        >
            {children}
        </ListingContext.Provider>
    );
};

export type ListingContextType = {
    listing: ListingType | null;
    listings: ListingType[];
    page: number;
    pages: number;
    nextPageLink: string | null;
    previousPageLink: string | null;
    setListing: React.Dispatch<React.SetStateAction<ListingType | null>>;
    setListings: React.Dispatch<React.SetStateAction<ListingType[]>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setPages: React.Dispatch<React.SetStateAction<number>>;
    setNextPageLink: React.Dispatch<React.SetStateAction<string | null>>;
    setPreviousPageLink: React.Dispatch<React.SetStateAction<string | null>>;
    getOneListing: (listingId: string | number, updateState?: boolean) => Promise<ListingType | null>;
    getOneListingForSeller: (listingId: string | number, updateState?: boolean) => Promise<ListingType | null>;
    getOneListingForAgent: (listingId: string | number, updateState?: boolean) => Promise<ListingType | null>;
    getListings: (searchParams?: string, updateState?: boolean) => Promise<PaginatedListingsType | null>;
    getListingsForSeller: (searchParams?: string, updateState?: boolean) => Promise<PaginatedListingsType | null>;
    getListingsForAgent: (searchParams?: string, updateState?: boolean) => Promise<PaginatedListingsType | null>;
    createListingForSeller: (formData: FormData) => Promise<APIResponseType>;
    createListingForAgent: (formData: FormData) => Promise<APIResponseType>;
    editListingForSeller: (formData: FormData, listingId: number) => Promise<APIResponseType>;
    editListingForAgent: (formData: FormData, listingId: number) => Promise<APIResponseType>;
    deleteListingForSeller: (listingId: number | string) => Promise<boolean>;
    deleteListingForAgent: (listingId: number | string) => Promise<boolean>;
};

const initListingContextState: ListingContextType = {
    listing: null,
    listings: [],
    page: 1,
    pages: 1,
    nextPageLink: null,
    previousPageLink: null,
    setListing: () => {},
    setListings: () => {},
    setPage: () => {},
    setPages: () => {},
    setNextPageLink: () => {},
    setPreviousPageLink: () => {},
    getOneListing: () => Promise.resolve(null),
    getOneListingForSeller: () => Promise.resolve(null),
    getOneListingForAgent: () => Promise.resolve(null),
    getListings: () => Promise.resolve(null),
    getListingsForSeller: () => Promise.resolve(null),
    getListingsForAgent: () => Promise.resolve(null),
    createListingForSeller: () => Promise.resolve({ success: false }),
    createListingForAgent: () => Promise.resolve({ success: false }),
    editListingForSeller: () => Promise.resolve({ success: false }),
    editListingForAgent: () => Promise.resolve({ success: false }),
    deleteListingForSeller: () => Promise.resolve(false),
    deleteListingForAgent: () => Promise.resolve(false),
};

const ListingContext = createContext<ListingContextType>(initListingContextState);

export default ListingContext;
