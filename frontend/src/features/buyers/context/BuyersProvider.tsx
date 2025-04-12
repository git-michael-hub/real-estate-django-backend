import { createContext, useState } from "react";
import { apiFns, APIResponseType, HeaderType } from "../../../utils/api-service";
import cookieHandler, { Token } from "../../../utils/cookie-handler";

export const API_DIRECTORY_BUYERS = "api/buyers/";

type ChildrenType = { children?: React.ReactElement | React.ReactElement[] };

export const BuyersProvider = ({ children }: ChildrenType) => {
    const [favoriteListings, setFavoriteListings] = useState<any[]>([]);

    const fetchFavoriteListings = async (username: string): Promise<any[]> => {
        const token: Token = cookieHandler.get("token");
        const headers: HeaderType = { Authorization: `Token ${token}` };

        try {
            const response: APIResponseType | undefined = await apiFns.get(
                API_DIRECTORY_BUYERS + `${username}/wishlist`,
                headers
            );
            if (response.success) {
                setFavoriteListings(response.data.favorite_listings);
                return response.data.favorite_listings;
            } else {
                setFavoriteListings([]);
                return [];
            }
        } catch (error) {
            alert(`An error has occurred.`);
            return [];
        }
    };

    const editFavorites = async (e: React.FormEvent<HTMLFormElement>, username: string) => {
        e.preventDefault();
        const token: Token = cookieHandler.get("token");
        const headers: HeaderType = { Authorization: `Token ${token}` };
        const body: FormData = new FormData(e.currentTarget);
        const response: APIResponseType = await apiFns.patch(
            API_DIRECTORY_BUYERS + `${username}/favorite-listings`,
            body,
            headers
        );
        setFavoriteListings(response.data.favorite_listings);
    };

    return (
        <BuyerContext.Provider
            value={{
                favoriteListings,
                setFavoriteListings,
                fetchFavoriteListings,
                editFavorites,
            }}
        >
            {children}
        </BuyerContext.Provider>
    );
};

export type BuyerContextType = {
    favoriteListings: any[];
    setFavoriteListings: React.Dispatch<React.SetStateAction<any[]>>;
    fetchFavoriteListings: (username: string) => Promise<any>;
    editFavorites: (e: React.FormEvent<HTMLFormElement>, username: string) => Promise<void>;
};

const initBuyerContextState: BuyerContextType = {
    favoriteListings: [],
    setFavoriteListings: () => {},
    fetchFavoriteListings: () => Promise.resolve([]),
    editFavorites: () => Promise.resolve(),
};

const BuyerContext = createContext<BuyerContextType>(initBuyerContextState);

export default BuyerContext;
