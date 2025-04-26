import { createContext, useState } from "react";
import { apiFns, APIResponseType, HeaderType } from "../../../utils/api-service";
import cookieHandler, { Token } from "../../../utils/cookie-handler";
import { API_URLS } from "../../../urls/api-urls";
import { WishlistType, WishlistEntryType } from "../../../types/types";

type ChildrenType = { children?: React.ReactElement | React.ReactElement[] };

export const BuyersProvider = ({ children }: ChildrenType) => {
    const [wishlist, setWishlist] = useState<WishlistType>([]);
    const [wishlistIds, setWishlistIds] = useState<number[]>([]);

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
        if (response.success) {
            setWishlist(response.data);
            setWishlistIds(getListingIdsInWishlist(response.data));
            return response.data;
        } else {
            setWishlist([]);
            setWishlistIds([]);
            return [];
        }
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
                wishlist,
                wishlistIds,
                setWishlist,
                setWishlistIds,
                fetchWishlist,
                addToWishlist,
                removeFromWishlist,
            }}
        >
            {children}
        </BuyerContext.Provider>
    );
};

export type BuyerContextType = {
    wishlist: WishlistType;
    wishlistIds: number[];
    setWishlist: React.Dispatch<React.SetStateAction<WishlistType>>;
    setWishlistIds: React.Dispatch<React.SetStateAction<number[]>>;
    fetchWishlist: (username: string) => Promise<any>;
    addToWishlist: (e: React.FormEvent<HTMLFormElement>, username: string, listingId: number) => Promise<void>;
    removeFromWishlist: (
        e: React.FormEvent<HTMLFormElement>,
        username: string,
        wishlistEntryPk: number
    ) => Promise<void>;
};

const initBuyerContextState: BuyerContextType = {
    wishlist: [],
    wishlistIds: [],
    setWishlist: () => {},
    setWishlistIds: () => {},
    fetchWishlist: () => Promise.resolve([]),
    addToWishlist: () => Promise.resolve(),
    removeFromWishlist: () => Promise.resolve(),
};

const BuyerContext = createContext<BuyerContextType>(initBuyerContextState);

export default BuyerContext;
