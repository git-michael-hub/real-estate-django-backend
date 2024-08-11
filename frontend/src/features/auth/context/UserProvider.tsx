import { createContext, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { apiFns } from "../../../ts/api-service";
import cookieHandler from "../../../ts/cookie-handler";

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

const initUserState: UserType = { user_id: 0, username: "", email: "", first_name: "", last_name: "" };

const useUserContext = (initUserState: UserType) => {
    const [user, setUser] = useState<UserType>(initUserState);
    const [formMessages, setFormMessages] = useState<FormMessageType>({ no_message: [""] });
    const navigate: NavigateFunction = useNavigate();

    const login = async (formData: FormData): Promise<void> => {
        try {
            const response = await apiFns.post("user/login", formData);
            const isSuccess: boolean = response.ok;
            if (isSuccess) {
                const data: { token: string; user: UserType } = await response.json();
                const successMessage: FormMessageType = { success_message: ["Login success!"] };
                cookieHandler.set("token", data.token);
                setUser(data.user);
                setFormMessages(successMessage);
                navigate("/");
            } else {
                const errorMessages: FormMessageType = await response.json();
                console.log(errorMessages);
                setFormMessages(errorMessages);
            }
        } catch (error) {
            console.log(`Error encountered in UserProvider: \n${error}`);
            const errorMessage: FormMessageType = { generic_message: ["An error occurred."] };
            setFormMessages(errorMessage);
        }
    };

    const register = async (formData: FormData): Promise<void> => {
        try {
            const response = await apiFns.post("user/register", formData);
            const isSuccess: boolean = response.ok;
            if (isSuccess) {
                const successMessage: FormMessageType = { success_message: ["Registration complete!"] };
                setFormMessages(successMessage);
                navigate("/login");
            } else {
                const errorMessages: FormMessageType = await response.json();
                setFormMessages(errorMessages);
            }
        } catch (error) {
            console.log(`Error encountered in UserProvider: \n${error}`);
            const errorMessage: FormMessageType = { generic_message: ["An error occurred."] };
            setFormMessages(errorMessage);
        }
    };

    return { user, formMessages, login, register };
};

export type UseUserContextType = ReturnType<typeof useUserContext>;

const initUserContextState: UseUserContextType = {
    user: initUserState,
    formMessages: { no_message: [""] },
    login: () => Promise.resolve(),
    register: () => Promise.resolve(),
};

const UserContext = createContext<UseUserContextType>(initUserContextState);

type ChildrenType = { children?: React.ReactElement | React.ReactElement[] };

export const UserProvider = ({ children }: ChildrenType): React.ReactElement => {
    return <UserContext.Provider value={useUserContext(initUserState)}>{children}</UserContext.Provider>;
};

export default UserContext;
