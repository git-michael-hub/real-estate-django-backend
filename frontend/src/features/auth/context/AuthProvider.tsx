import { createContext, useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { apiFns, HeaderType } from "../../../ts/api-service";
import cookieHandler, { Token } from "../../../ts/cookie-handler";
import { APIResponseType } from "../../../ts/api-service";

export type UserType = {
    id: number;
    username: string;
    email: string;
    roles: string[];
};

export type UserStateType = UserType | null;

export type FormMessageStateType = {
    success?: string[];
    error?: string[];
    username?: string[];
    email?: string[];
    first_name?: string[];
    last_name?: string[];
    password?: string[];
    non_field_errors?: string[];
    new_password?: string[];
    confirm_password?: string[];
    pin_code?: string[];
};

type ChildrenType = { children?: React.ReactElement | React.ReactElement[] };

export const AuthProvider = ({ children }: ChildrenType): React.ReactElement => {
    const [user, setUser] = useState<UserStateType>(null);
    const [isReady, setIsReady] = useState<boolean>(false);
    const navigate: NavigateFunction = useNavigate();

    // Runs everytime the page refreshes then runs fetchAuthUser.
    // use and isReady state is then updated using setUser.
    useEffect(() => {
        if (!user) {
            fetchAuthUser()
                .then((user: UserStateType) => setUser(user))
                .then(() => setIsReady(true)); // makes sure user state is mounted first
        }
    }, []);

    const processForm = async (
        endpoint: string,
        formData: FormData,
        successString: string = "Success.",
        headers?: HeaderType
    ): Promise<{ message: FormMessageStateType; data?: any }> => {
        try {
            const response: APIResponseType = await apiFns.post(endpoint, formData, headers);
            if (response.success) {
                const successMessage: FormMessageStateType = { success: [successString] };
                return { message: successMessage, data: response.data };
            } else {
                const errorMessages: FormMessageStateType = response.data;
                return { message: errorMessages };
            }
        } catch (error: unknown) {
            console.log(
                `An error occurred at function ${processForm.caller.name}() inside AuthProvider.tsx. \n${error}`
            );
            const errorMessage: FormMessageStateType = { error: [`An error occurred.`] };
            return { message: errorMessage };
        }
    };

    // Fetch authenticated user from backend.
    // Returns null if there is currently no authenticated user.
    const fetchAuthUser = async (): Promise<UserStateType> => {
        const token: Token = cookieHandler.get("token");
        if (!token) return null;

        try {
            const headers: HeaderType = { Authorization: `Token ${token}` };
            const response: APIResponseType = await apiFns.get("users/auth-user", headers);
            if (!response.success) return null;
            const user: UserStateType = response.data;
            return user;
        } catch (error: unknown) {
            console.log(`An error occurred at function ${fetchAuthUser.name}() inside AuthProvider.tsx. \n${error}`);
            return null;
        }
    };

    const login = async (formData: FormData): Promise<FormMessageStateType> => {
        const { message, data } = await processForm("users/login", formData, "Login success!");
        if (message.success) {
            const token: Token = data.token;
            const user: UserType = data.user;
            cookieHandler.set("token", token);
            setUser(user);
        }
        return message;
    };

    const requestEmailValidation = async (
        endpoint: "buyers/email-validation" | "sellers/email-validation",
        formData: FormData
    ): Promise<FormMessageStateType> => {
        const { message } = await processForm(endpoint, formData, "We have sent a 6-digit PIN to your email.");
        return message;
    };

    const register = async (
        endpoint: "buyers/register" | "sellers/register",
        formData: FormData
    ): Promise<FormMessageStateType> => {
        const { message } = await processForm(endpoint, formData, "Registration complete!");
        return message;
    };

    const logout = async (): Promise<FormMessageStateType> => {
        const formData: FormData = new FormData();
        const token: Token = cookieHandler.get("token");
        const headers: HeaderType = { Authorization: `Token ${token}` };
        const { message } = await processForm("users/logout", formData, "Successfully logged out.", headers);
        if (message.success) {
            cookieHandler.delete("token");
            setUser(null);
            navigate("/login");
        }
        return message;
    };

    const requestResetPassword = async (formData: FormData): Promise<FormMessageStateType> => {
        const { message } = await processForm(
            "users/request-password-reset",
            formData,
            "We have sent a link to your email address."
        );
        return message;
    };

    const resetPassword = async (formData: FormData, resetToken: string): Promise<FormMessageStateType> => {
        try {
            const response: APIResponseType = await apiFns.post(`users/password-reset/${resetToken}`, formData);
            const messages = response.data;
            return messages;
        } catch (error) {
            console.log(`An error occurred at function ${resetPassword.name}() inside AuthProvider.tsx. \n${error}`);
            const messages = { error: [`An error occurred.`] };
            return messages;
        }
    };

    const isSeller = (): boolean => {
        if (!user) return false;
        return user.roles.includes("seller");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                fetchAuthUser,
                login,
                requestEmailValidation,
                register,
                logout,
                requestResetPassword,
                resetPassword,
                isSeller,
            }}
        >
            {isReady ? children : null}
        </AuthContext.Provider>
    );
};

export type AuthContextType = {
    user: UserStateType;
    setUser: React.Dispatch<React.SetStateAction<UserStateType>>;
    fetchAuthUser: () => Promise<UserStateType>;
    login: (formData: FormData) => Promise<FormMessageStateType>;
    requestEmailValidation: (
        endpoint: "buyers/email-validation" | "sellers/email-validation",
        formData: FormData
    ) => Promise<FormMessageStateType>;
    register: (endpoint: "buyers/register" | "sellers/register", formData: FormData) => Promise<FormMessageStateType>;
    logout: () => Promise<FormMessageStateType>;
    requestResetPassword: (formData: FormData) => Promise<FormMessageStateType>;
    resetPassword: (formData: FormData, resetToken: string) => Promise<FormMessageStateType>;
    isSeller: () => boolean;
};

// Initial state of the AuthContext
const initAuthContextState: AuthContextType = {
    user: null,
    setUser: () => {},
    fetchAuthUser: () => Promise.resolve(null),
    login: () => Promise.resolve({}),
    requestEmailValidation: () => Promise.resolve({}),
    register: () => Promise.resolve({}),
    logout: () => Promise.resolve({}),
    requestResetPassword: () => Promise.resolve({}),
    resetPassword: () => Promise.resolve({}),
    isSeller: () => false,
};

const AuthContext = createContext<AuthContextType>(initAuthContextState);

export default AuthContext;
