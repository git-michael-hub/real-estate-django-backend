import { createContext, useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { apiFns, HeaderType } from "../../../ts/api-service";
import cookieHandler, { Token } from "../../../ts/cookie-handler";
import { RolesType } from "../components/RequireAuth/RequireAuth";

export type UserStateType = {
    user_id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    roles?: RolesType;
} | null;

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
    pin?: string[];
};

type ChildrenType = { children?: React.ReactElement | React.ReactElement[] };

export const AuthProvider = ({ children }: ChildrenType): React.ReactElement => {
    const [user, setUser] = useState<UserStateType>(null);
    const [isReady, setIsReady] = useState<boolean>(false);
    const navigate: NavigateFunction = useNavigate();

    // Runs everytime the page refreshes then runs fetchAuthUser.
    // use and isReady state is then updated using setUser.
    useEffect(() => {
        fetchAuthUser()
            .then((user: UserStateType) => setUser(user))
            .then(() => setIsReady(true)); // makes sure user state is mounted first
    }, []);

    // Fetch authenticated user from backend.
    // Returns null if there is currently no authenticated user.
    const fetchAuthUser = async (): Promise<UserStateType> => {
        const token: Token = cookieHandler.get("token");
        if (!token) return null;

        try {
            const headers: HeaderType = { Authorization: `Token ${token}` };
            const response: Response = await apiFns.get("user/auth-user", headers);
            if (!response.ok) return null;
            const user: UserStateType = await response.json();
            return user;
        } catch (error: unknown) {
            console.log(`An error occurred at function ${fetchAuthUser.name}() inside AuthProvider.tsx. \n${error}`);
            return null;
        }
    };

    const login = async (formData: FormData): Promise<FormMessageStateType> => {
        try {
            const response: Response = await apiFns.post("user/login", formData);
            if (response.ok) {
                const data: { token: string; user: UserStateType } = await response.json();
                const successMessage: FormMessageStateType = { success: ["Login success!"] };
                cookieHandler.set("token", data.token);
                setUser(data.user);
                return successMessage;
            } else {
                const errorMessages: FormMessageStateType = await response.json();
                return errorMessages;
            }
        } catch (error: unknown) {
            console.log(`An error occurred at function ${login.name}() inside AuthProvider.tsx. \n${error}`);
            const message = { error: [`An error occurred.`] };
            return message;
        }
    };

    const register = async (formData: FormData): Promise<FormMessageStateType> => {
        try {
            const response: Response = await apiFns.post("user/register", formData);
            const message = await response.json();
            return message;
        } catch (error: unknown) {
            console.log(`An error occurred at function ${register.name}() inside AuthProvider.tsx. \n${error}`);
            const message = { error: [`An error occurred.`] };
            return message;
        }
    };

    const completeRegistration = async (formData: FormData): Promise<FormMessageStateType> => {
        try {
            const response: Response = await apiFns.post("user/complete-registration", formData);
            const message = await response.json();
            return message;
        } catch (error: unknown) {
            console.log(
                `An error occurred at function ${completeRegistration.name}() inside AuthProvider.tsx: \n${error}`
            );
            const message = { error: [`An error occurred.`] };
            return message;
        }
    };

    const logout = async (): Promise<FormMessageStateType> => {
        const formData: FormData = new FormData();
        const token: Token = cookieHandler.get("token");
        if (!token) throw Error("Not authorized.");

        try {
            const headers: HeaderType = { Authorization: `Token ${token}` };
            const response: Response = await apiFns.post("user/logout", formData, headers);
            const messages: FormMessageStateType = await response.json();
            if (response.ok) {
                cookieHandler.delete("token");
                setUser(null);
                navigate("/login");
            }
            return messages;
        } catch (error: unknown) {
            console.log(`An error occurred at function ${logout.name}() inside AuthProvider.tsx. \n${error}`);
            const messages = { error: [`An error occurred.`] };
            return messages;
        }
    };

    const requestResetPassword = async (formData: FormData): Promise<FormMessageStateType> => {
        try {
            const response: Response = await apiFns.post("user/request-password-reset", formData);
            const messages = await response.json();
            return messages;
        } catch (error) {
            console.log(
                `An error occurred at function ${requestResetPassword.name}() inside AuthProvider.tsx. \n${error}`
            );
            const messages = { error: [`An error occurred.`] };
            return messages;
        }
    };

    const resetPassword = async (formData: FormData, resetToken: string): Promise<FormMessageStateType> => {
        try {
            const response: Response = await apiFns.post(`user/password-reset/${resetToken}`, formData);
            const messages = await response.json();
            return messages;
        } catch (error) {
            console.log(`An error occurred at function ${resetPassword.name}() inside AuthProvider.tsx. \n${error}`);
            const messages = { error: [`An error occurred.`] };
            return messages;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                fetchAuthUser,
                login,
                register,
                completeRegistration,
                logout,
                requestResetPassword,
                resetPassword,
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
    register: (formData: FormData) => Promise<FormMessageStateType>;
    completeRegistration: (formData: FormData) => Promise<FormMessageStateType>;
    logout: () => Promise<FormMessageStateType>;
    requestResetPassword: (formData: FormData) => Promise<FormMessageStateType>;
    resetPassword: (formData: FormData, resetToken: string) => Promise<FormMessageStateType>;
};

// Initial state of the AuthContext
const initAuthContextState: AuthContextType = {
    user: null,
    setUser: () => {},
    fetchAuthUser: () => Promise.resolve(null),
    login: () => Promise.resolve({}),
    register: () => Promise.resolve({}),
    completeRegistration: () => Promise.resolve({}),
    logout: () => Promise.resolve({}),
    requestResetPassword: () => Promise.resolve({}),
    resetPassword: () => Promise.resolve({}),
};

const AuthContext = createContext<AuthContextType>(initAuthContextState);

export default AuthContext;
