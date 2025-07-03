import { createContext, useState } from "react";
import { apiFns, APIResponseType, HeaderType } from "../../../utils/api-service";
import cookieHandler, { Token } from "../../../utils/cookie-handler";
import { API_URLS } from "../../../urls/api-urls";
import { SellerAccountType } from "../../../types/seller";

type ChildrenType = { children?: React.ReactElement | React.ReactElement[] };

export const SellersProvider = ({ children }: ChildrenType) => {
    const [seller, setSeller] = useState<SellerAccountType | null>(null);

    const fetchSeller = async (username: string): Promise<SellerAccountType | null> => {
        const response: APIResponseType = await apiFns.get(API_URLS.SELLER.RETRIEVE(username));
        if (response.success) return response.data as SellerAccountType;
        console.log(response.err_messages);
        return null;
    };

    const fetchSellerAndUpdateState = async (username: string): Promise<SellerAccountType | null> => {
        const seller: SellerAccountType | null = await fetchSeller(username);
        setSeller(seller);
        return seller;
    };

    const editProfile = async (username: string, formData: FormData): Promise<APIResponseType> => {
        const token: Token = cookieHandler.get("token");
        const headers: HeaderType = { Authorization: `Token ${token}` };
        const response: APIResponseType = await apiFns.patch(API_URLS.SELLER.EDIT(username), formData, headers);
        if (!response.success) console.log(response.err_messages);
        return response;
    };

    const editProfileAndUpdateState = async (username: string, formData: FormData): Promise<APIResponseType> => {
        const response: APIResponseType = await editProfile(username, formData);
        if (response.success) setSeller(response.data as SellerAccountType);
        return response;
    };

    return (
        <sellerContext.Provider
            value={{
                seller,
                setSeller,
                fetchSeller,
                fetchSellerAndUpdateState,
                editProfile,
                editProfileAndUpdateState,
            }}
        >
            {children}
        </sellerContext.Provider>
    );
};

export type SellerContextType = {
    seller: SellerAccountType | null;
    setSeller: React.Dispatch<React.SetStateAction<SellerAccountType | null>>;
    fetchSeller: (username: string) => Promise<SellerAccountType | null>;
    fetchSellerAndUpdateState: (username: string) => Promise<SellerAccountType | null>;
    editProfile: (username: string, formData: FormData) => Promise<APIResponseType>;
    editProfileAndUpdateState: (username: string, formData: FormData) => Promise<APIResponseType>;
};

const initSellerContextState: SellerContextType = {
    seller: null,
    setSeller: () => null,
    fetchSeller: () => Promise.resolve(null),
    fetchSellerAndUpdateState: () => Promise.resolve(null),
    editProfile: () => Promise.resolve({ success: false }),
    editProfileAndUpdateState: () => Promise.resolve({ success: false }),
};

const sellerContext = createContext<SellerContextType>(initSellerContextState);

export default sellerContext;
