import { createContext, useState } from "react";
import { apiFns, APIResponseType, HeaderType } from "../../../utils/api-service";
import cookieHandler, { Token } from "../../../utils/cookie-handler";
import { API_URLS } from "../../../urls/api-urls";
import { WishlistType, WishlistEntryType, BuyerAccountType } from "../../../types/types";

type ChildrenType = { children?: React.ReactElement | React.ReactElement[] };

export const BuyersProvider = ({ children }: ChildrenType) => {
    const [buyer, setBuyer] = useState<BuyerAccountType | null>(null);
    const [wishlist, setWishlist] = useState<WishlistType>([]);
    const [wishlistIds, setWishlistIds] = useState<number[]>([]);

    const fetchBuyer = async (username: string): Promise<BuyerAccountType | null> => {
        const response: APIResponseType = await apiFns.get(API_URLS.BUYER.RETRIEVE(username));
        if (response.success) return response.data as BuyerAccountType;
        console.log(response.err_messages);
        return null;
    };

    const fetchBuyerAndUpdateState = async (username: string): Promise<BuyerAccountType | null> => {
        const buyer: BuyerAccountType | null = await fetchBuyer(username);
        setBuyer(buyer);
        return buyer;
    };

    const editProfile = async (username: string, formData: FormData): Promise<APIResponseType> => {
        const token: Token = cookieHandler.get("token");
        const headers: HeaderType = { Authorization: `Token ${token}` };
        const response: APIResponseType = await apiFns.patch(API_URLS.BUYER.EDIT(username), formData, headers);
        if (!response.success) console.log(response.err_messages);
        return response;
    };

    const editProfileAndUpdateState = async (username: string, formData: FormData): Promise<APIResponseType> => {
        const response: APIResponseType = await editProfile(username, formData);
        if (response.success) setBuyer(response.data as BuyerAccountType);
        return response;
    };

    const getListingIdsInWishlist = (wishlist: WishlistType): number[] => {
        const listingIdList: number[] = [];
        wishlist.forEach((wishlistEntry: WishlistEntryType) => {
            listingIdList.push(wishlistEntry.listing.id);
        });
        return listingIdList;
    };

    const fetchWishlist = async (username: string): Promise<WishlistType> => {
        const token: Token = cookieHandler.get("token");
        const headers: HeaderType = { Authorization: `Token ${token}` };
        const response: APIResponseType = await apiFns.get(API_URLS.BUYER.WISHLIST(username), headers);
        if (response.success) return response.data;
        return [];
    };

    const fetchWishlistAndUpdateState = async (username: string): Promise<WishlistType> => {
        const wishlist: WishlistType = await fetchWishlist(username);
        setWishlist(wishlist);
        setWishlistIds(getListingIdsInWishlist(wishlist));
        return wishlist;
    };

    const addToWishlist = async (
        e: React.FormEvent<HTMLFormElement>,
        username: string,
        listingId: number
    ): Promise<void> => {
        e.preventDefault();
        const body: string = JSON.stringify({ listing: listingId });
        const token: Token = cookieHandler.get("token");
        const headers: HeaderType = { Authorization: `Token ${token}`, "Content-Type": "application/json" };
        const response: APIResponseType = await apiFns.post(API_URLS.BUYER.WISHLIST(username), body, headers);
        if (!response.success) console.log(response.err_messages);
        else {
            const wishstListEntry: WishlistEntryType = response.data;
            setWishlist((wishlist) => [...wishlist, wishstListEntry]);
            setWishlistIds((prevWishlistIds) => [...prevWishlistIds, wishstListEntry.listing.id]);
        }
    };

    const removeFromWishlist = async (
        e: React.FormEvent<HTMLFormElement>,
        username: string,
        listingId: number
    ): Promise<void> => {
        e.preventDefault();
        const wishlistEntry: WishlistEntryType | undefined = wishlist.find(
            (wishlistEntry) => wishlistEntry.listing.id === listingId
        );
        if (!wishlistEntry) return console.log({ error: ["Listing does not exist in wishlist."] });
        const token: Token = cookieHandler.get("token");
        const headers: HeaderType = { Authorization: `Token ${token}` };
        const response: APIResponseType = await apiFns.del(
            API_URLS.BUYER.REMOVE_FROM_WISHLIST(username, wishlistEntry.pk),
            headers
        );
        if (!response.success) console.log(response.err_messages);
        else {
            setWishlist((prevWishlist) =>
                prevWishlist.filter((wishlistEntry) => wishlistEntry.listing.id !== listingId)
            );
            setWishlistIds((prevWishlistIds) => prevWishlistIds.filter((id) => id !== listingId));
        }
    };

    return (
        <BuyerContext.Provider
            value={{
                buyer,
                wishlist,
                wishlistIds,
                setBuyer,
                setWishlist,
                setWishlistIds,
                fetchBuyer,
                fetchBuyerAndUpdateState,
                fetchWishlist,
                fetchWishlistAndUpdateState,
                addToWishlist,
                removeFromWishlist,
                editProfile,
                editProfileAndUpdateState,
            }}
        >
            {children}
        </BuyerContext.Provider>
    );
};

export type BuyerContextType = {
    buyer: BuyerAccountType | null;
    wishlist: WishlistType;
    wishlistIds: number[];
    setBuyer: React.Dispatch<React.SetStateAction<BuyerAccountType | null>>;
    setWishlist: React.Dispatch<React.SetStateAction<WishlistType>>;
    setWishlistIds: React.Dispatch<React.SetStateAction<number[]>>;
    fetchBuyer: (username: string) => Promise<BuyerAccountType | null>;
    fetchBuyerAndUpdateState: (username: string) => Promise<BuyerAccountType | null>;
    fetchWishlist: (username: string) => Promise<WishlistType>;
    fetchWishlistAndUpdateState: (username: string) => Promise<WishlistType>;
    addToWishlist: (e: React.FormEvent<HTMLFormElement>, username: string, listingId: number) => Promise<void>;
    removeFromWishlist: (
        e: React.FormEvent<HTMLFormElement>,
        username: string,
        wishlistEntryPk: number
    ) => Promise<void>;
    editProfile: (username: string, formData: FormData) => Promise<APIResponseType>;
    editProfileAndUpdateState: (username: string, formData: FormData) => Promise<APIResponseType>;
};

const initBuyerContextState: BuyerContextType = {
    buyer: null,
    wishlist: [],
    wishlistIds: [],
    setBuyer: () => null,
    setWishlist: () => {},
    setWishlistIds: () => {},
    fetchBuyer: () => Promise.resolve(null),
    fetchBuyerAndUpdateState: () => Promise.resolve(null),
    fetchWishlist: () => Promise.resolve([]),
    fetchWishlistAndUpdateState: () => Promise.resolve([]),
    addToWishlist: () => Promise.resolve(),
    removeFromWishlist: () => Promise.resolve(),
    editProfile: () => Promise.resolve({ success: false }),
    editProfileAndUpdateState: () => Promise.resolve({ success: false }),
};

const BuyerContext = createContext<BuyerContextType>(initBuyerContextState);

export default BuyerContext;
