import { createContext, useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { apiFns, HeaderType } from "../../../utils/api-service";
import cookieHandler, { Token } from "../../../utils/cookie-handler";
import { APIResponseType } from "../../../utils/api-service";
import { AuthUserType, AuthFormMessageType } from "../../../types/types";
import { API_URLS } from "../../../urls/api-urls";

type ChildrenType = { children?: React.ReactElement | React.ReactElement[] };

export const AuthProvider = ({ children }: ChildrenType): React.ReactElement => {
    const [user, setUser] = useState<AuthUserType | null>(null);
    const [isReady, setIsReady] = useState<boolean>(false);
    const navigate: NavigateFunction = useNavigate();

    // Runs everytime the page refreshes then runs fetchAuthUser.
    // user and isReady state is then updated using setUser.
    useEffect(() => {
        if (!user) {
            fetchAuthUser()
                .then((user: AuthUserType | null) => setUser(user))
                .then(() => setIsReady(true)); // makes sure user state is mounted first
        }
    }, []);

    // Fetch authenticated user from backend.
    // Returns null if there is currently no authenticated user.
    const fetchAuthUser = async (): Promise<AuthUserType | null> => {
        const token: Token = cookieHandler.get("token");
        if (!token) return null;

        const headers: HeaderType = { Authorization: `Token ${token}` };
        const response: APIResponseType = await apiFns.get(API_URLS.AUTH.USER(), headers);
        if (!response.success) return null;

        const user: AuthUserType = response.data;
        return user;
    };

    const login = async (formData: FormData): Promise<AuthFormMessageType> => {
        const response: APIResponseType = await apiFns.post(API_URLS.AUTH.LOGIN(), formData);
        if (!response.success) return response.err_messages as AuthFormMessageType;

        const token: Token = response.data.token;
        const user: AuthUserType = response.data.user;
        const success_message: AuthFormMessageType = { success: ["Successfully logged in!"] };
        cookieHandler.set("token", token);
        setUser(user);
        return success_message;
    };

    const register = async (formData: FormData): Promise<AuthFormMessageType> => {
        const response: APIResponseType = await apiFns.post(API_URLS.AUTH.REGISTER(), formData);
        if (!response.success) return response.err_messages as AuthFormMessageType;
        const success_message: AuthFormMessageType = { success: ["We have sent a 6-digit PIN to your email."] };
        return success_message;
    };

    const verifyEmail = async (email: string, formData: FormData): Promise<AuthFormMessageType> => {
        const response: APIResponseType = await apiFns.patch(API_URLS.AUTH.VERIFY_EMAIL(email), formData);
        if (!response.success) return response.err_messages as AuthFormMessageType;
        const success_message: AuthFormMessageType = { success: ["Email verification complete."] };
        return success_message;
    };

    const logout = async (): Promise<AuthFormMessageType> => {
        const formData: FormData = new FormData();
        const token: Token = cookieHandler.get("token");
        const headers: HeaderType = { Authorization: `Token ${token}` };
        const response = await apiFns.post(API_URLS.AUTH.LOGOUT(), formData, headers);
        if (!response.success) return response.err_messages as AuthFormMessageType;
        const success_message: AuthFormMessageType = { success: ["Successfully logged out!"] };
        cookieHandler.delete("token");
        setUser(null);
        navigate("/login");
        return success_message;
    };

    const requestResetPassword = async (formData: FormData): Promise<AuthFormMessageType> => {
        const response: APIResponseType = await apiFns.post(API_URLS.AUTH.REQUEST_PASSWORD_RESET(), formData);
        if (!response.success) return response.err_messages as AuthFormMessageType;
        const success_message: AuthFormMessageType = { success: ["We have sent a link to your email address."] };
        return success_message;
    };

    const resetPassword = async (formData: FormData, resetToken: string): Promise<AuthFormMessageType> => {
        const response: APIResponseType = await apiFns.patch(API_URLS.AUTH.RESET_PASSWORD(resetToken), formData);
        if (!response.success) return response.err_messages as AuthFormMessageType;
        const success_message: AuthFormMessageType = { success: ["Password reset successful!"] };
        return success_message;
    };

    const isSeller = (): boolean => {
        if (!user) return false;
        return user.roles.includes("seller");
    };

    const isAgent = (): boolean => {
        if (!user) return false;
        return user.roles.includes("agent");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                fetchAuthUser,
                login,
                verifyEmail,
                register,
                logout,
                requestResetPassword,
                resetPassword,
                isSeller,
                isAgent,
            }}
        >
            {isReady ? children : null}
        </AuthContext.Provider>
    );
};

export type AuthContextType = {
    user: AuthUserType | null;
    setUser: React.Dispatch<React.SetStateAction<AuthUserType | null>>;
    fetchAuthUser: () => Promise<AuthUserType | null>;
    login: (formData: FormData) => Promise<AuthFormMessageType>;
    verifyEmail: (email: string, formData: FormData) => Promise<AuthFormMessageType>;
    register: (formData: FormData) => Promise<AuthFormMessageType>;
    logout: () => Promise<AuthFormMessageType>;
    requestResetPassword: (formData: FormData) => Promise<AuthFormMessageType>;
    resetPassword: (formData: FormData, resetToken: string) => Promise<AuthFormMessageType>;
    isSeller: () => boolean;
    isAgent: () => boolean;
};

// Initial state of the AuthContext
const initAuthContextState: AuthContextType = {
    user: null,
    setUser: () => {},
    fetchAuthUser: () => Promise.resolve(null),
    login: () => Promise.resolve({}),
    verifyEmail: () => Promise.resolve({}),
    register: () => Promise.resolve({}),
    logout: () => Promise.resolve({}),
    requestResetPassword: () => Promise.resolve({}),
    resetPassword: () => Promise.resolve({}),
    isSeller: () => false,
    isAgent: () => false,
};

const AuthContext = createContext<AuthContextType>(initAuthContextState);

export default AuthContext;
