import { createContext, useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { apiFns, HeaderType } from "../../../ts/api-service";
import cookieHandler, { Token } from "../../../ts/cookie-handler";
import helperFn from "../components/VerifyEmailForm/ts/helper";

export type UserStateType = {
    user_id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
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
};

type ChildrenType = { children?: React.ReactElement | React.ReactElement[] };

export const AuthProvider = ({ children }: ChildrenType): React.ReactElement => {
    const [user, setUser] = useState<UserStateType>(null);
    const [formMessages, setFormMessages] = useState<FormMessageStateType>({});
    const [isReady, setIsReady] = useState<boolean>(false);
    const navigate: NavigateFunction = useNavigate();

    // Runs everytime the page refreshes then runs fetchAuthUser.
    // use and isReady state is then updated using setUser.
    useEffect(() => {
        fetchAuthUser()
            .then((user: UserStateType) => setUser(user))
            .then(() => setIsReady(true)); // makes sure user state is mounted first
    }, []);

    const catchError = (error: unknown, funcName: string) => {
        console.log(`Error encountered in UserProvider: ${funcName}() \n${error}`);
        const errorMessage: FormMessageStateType = { error: ["An error occurred."] };
        setFormMessages(errorMessage);
    };

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
            catchError(error, fetchAuthUser.name);
            return null;
        }
    };

    const login = async (formData: FormData): Promise<void> => {
        try {
            const response: Response = await apiFns.post("user/login", formData);
            if (response.ok) {
                const data: { token: string; user: UserStateType } = await response.json();
                const successMessage: FormMessageStateType = { success: ["Login success!"] };
                cookieHandler.set("token", data.token);
                setUser(data.user);
                setFormMessages(successMessage);
                navigate("/");
            } else {
                const errorMessages: FormMessageStateType = await response.json();
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
                const data: object[] = helperFn.convertFormToArrayObjects(formData);
                navigate("/verify-email", { state: { data: data } }); // NEEDS BUG FIXING, DATA CAN BE NULL CAUSING AN ERROR
            } else {
                const errorMessages: FormMessageStateType = await response.json();
                setFormMessages(errorMessages);
            }
        } catch (error: unknown) {
            catchError(error, register.name);
        }
    };

    const completeRegistration = async (formData: FormData): Promise<void> => {
        try {
            const response: Response = await apiFns.post("user/complete-registration", formData);
            if (response.ok) {
                const successMessage: FormMessageStateType = { success: ["Registration complete!"] };
                setFormMessages(successMessage);
                navigate("/login");
            } else {
                const errorMessages: FormMessageStateType = await response.json();
                setFormMessages(errorMessages);
            }
        } catch (error: unknown) {
            catchError(error, completeRegistration.name);
        }
    };

    const logout = async (formData: FormData): Promise<void> => {
        const token: Token = cookieHandler.get("token");
        if (!token) throw Error("Not authorized.");

        try {
            const headers: HeaderType = { Authorization: `Token ${token}` };
            const response: Response = await apiFns.post("user/logout", formData, headers);
            if (response.ok) {
                const successMessage: FormMessageStateType = await response.json();
                cookieHandler.delete("token");
                setUser(null);
                setFormMessages(successMessage);
                navigate("/login");
            } else {
                const errorMessage: FormMessageStateType = await response.json();
                setFormMessages(errorMessage);
            }
        } catch (error: unknown) {
            catchError(error, logout.name);
        }
    };

    const requestResetPassword = async (formData: FormData): Promise<void> => {
        try {
            const response: Response = await apiFns.post("user/request-password-reset", formData);
            if (response.ok) {
                const successMessage: FormMessageStateType = await response.json();
                setFormMessages(successMessage);
                console.log(successMessage);
            } else {
                const errorMessage: FormMessageStateType = await response.json();
                setFormMessages(errorMessage);
            }
        } catch (error) {
            catchError(error, requestResetPassword.name);
        }
    };

    const resetPassword = async (formData: FormData, resetToken: string): Promise<void> => {
        try {
            const response: Response = await apiFns.post(`user/password-reset/${resetToken}`, formData);
            if (response.ok) {
                const successMessage: FormMessageStateType = await response.json();
                setFormMessages(successMessage);
                navigate("/login");
            } else {
                const errorMessage: FormMessageStateType = await response.json();
                setFormMessages(errorMessage);
            }
        } catch (error) {
            catchError(error, requestResetPassword.name);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                formMessages,
                setUser,
                setFormMessages,
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
    formMessages: FormMessageStateType;
    setUser: React.Dispatch<React.SetStateAction<UserStateType>>;
    setFormMessages: React.Dispatch<React.SetStateAction<FormMessageStateType>>;
    fetchAuthUser: () => Promise<UserStateType>;
    login: (formData: FormData) => Promise<void>;
    register: (formData: FormData) => Promise<void>;
    completeRegistration: (formData: FormData) => Promise<void>;
    logout: (formData: FormData) => Promise<void>;
    requestResetPassword: (formData: FormData) => Promise<void>;
    resetPassword: (formData: FormData, resetToken: string) => Promise<void>;
};

// Initial state of the AuthContext
const initAuthContextState: AuthContextType = {
    user: null,
    formMessages: {},
    setUser: () => {},
    setFormMessages: () => {},
    fetchAuthUser: () => Promise.resolve(null),
    login: () => Promise.resolve(),
    register: () => Promise.resolve(),
    completeRegistration: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    requestResetPassword: () => Promise.resolve(),
    resetPassword: () => Promise.resolve(),
};

const AuthContext = createContext<AuthContextType>(initAuthContextState);

export default AuthContext;
