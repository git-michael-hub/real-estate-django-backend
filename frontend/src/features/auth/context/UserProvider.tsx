import { createContext, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { apiFns, HeaderType } from "../../../ts/api-service";
import cookieHandler, { Token } from "../../../ts/cookie-handler";

export type UserType = {
    user_id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
};

export type FormMessageType = {
    no_message?: string[];
    success_message?: string[];
    generic_message?: string[];
    username?: string[];
    email?: string[];
    first_name?: string[];
    last_name?: string[];
    password?: string[];
    non_field_errors?: string[];
};

export type UserStateType = UserType | null;

const initUserState: UserStateType = null;

const useUserContext = (initUserState: UserStateType) => {
    const [user, setUser] = useState<UserStateType>(initUserState);
    const [formMessages, setFormMessages] = useState<FormMessageType>({ no_message: [""] });
    const navigate: NavigateFunction = useNavigate();

    const catchError = (error: unknown, funcName: string) => {
        console.log(`Error encountered in UserProvider: ${funcName}() \n${error}`);
        const errorMessage: FormMessageType = { generic_message: ["An error occurred."] };
        setFormMessages(errorMessage);
    };

    const fetchUser = async (): Promise<UserStateType> => {
        const token: Token = cookieHandler.get("token");
        if (!token) return null;

        try {
            const headers: HeaderType = { Authorization: `Token ${token}` };
            const response: Response = await apiFns.get("user/auth", headers);
            if (!response.ok) return null;
            const user: UserType = await response.json();
            return user;
        } catch (error: unknown) {
            catchError(error, fetchUser.name);
            return null;
        }
    };

    const login = async (formData: FormData): Promise<void> => {
        try {
            const response: Response = await apiFns.post("user/login", formData);
            if (response.ok) {
                const data: { token: string; user: UserType } = await response.json();
                const successMessage: FormMessageType = { success_message: ["Login success!"] };
                cookieHandler.set("token", data.token);
                setUser(data.user);
                setFormMessages(successMessage);
                navigate("/");
            } else {
                const errorMessages: FormMessageType = await response.json();
                setFormMessages(errorMessages);
            }
        } catch (error: unknown) {
            catchError(error, login.name);
        }
    };

    const register = async (formData: FormData): Promise<void> => {
        try {
            const response: Response = await apiFns.post("user/register", formData);
            if (response.ok) {
                const successMessage: FormMessageType = { success_message: ["Registration complete!"] };
                setFormMessages(successMessage);
                navigate("/login");
            } else {
                const errorMessages: FormMessageType = await response.json();
                setFormMessages(errorMessages);
            }
        } catch (error: unknown) {
            catchError(error, register.name);
        }
    };

    const logout = async (formData: FormData): Promise<void> => {
        try {
            const headers: HeaderType = { Authorization: `Token ${cookieHandler.get("token")}` };
            const response: Response = await apiFns.post("user/logout", formData, headers);
            if (response.ok) {
                const successMessage: FormMessageType = await response.json();
                cookieHandler.delete("token");
                setFormMessages(successMessage);
                navigate("/login");
            } else {
                const errorMessage: FormMessageType = await response.json();
                setFormMessages(errorMessage);
            }
        } catch (error: unknown) {
            catchError(error, logout.name);
        }
    };

    return { user, formMessages, setUser, setFormMessages, fetchUser, login, register, logout };
};

export type UseUserContextType = ReturnType<typeof useUserContext>;

const initUserContextState: UseUserContextType = {
    user: initUserState,
    formMessages: { no_message: [""] },
    setUser: () => {},
    setFormMessages: () => {},
    fetchUser: () => Promise.resolve(null),
    login: () => Promise.resolve(),
    register: () => Promise.resolve(),
    logout: () => Promise.resolve(),
};

const UserContext = createContext<UseUserContextType>(initUserContextState);

type ChildrenType = { children?: React.ReactElement | React.ReactElement[] };

export const UserProvider = ({ children }: ChildrenType): React.ReactElement => {
    return <UserContext.Provider value={useUserContext(initUserState)}>{children}</UserContext.Provider>;
};

export default UserContext;
