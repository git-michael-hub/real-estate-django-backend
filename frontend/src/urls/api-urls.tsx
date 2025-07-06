// PRODUCTION
// export const BASE_URL: string = "http://52.77.229.203:80/";

// DEVELOPMENT
export const BASE_URL: string = "http://localhost:8000/";

export const API_DIRECTORY = {
    USER: BASE_URL + "api/auth",
    BUYER: BASE_URL + "api/buyers",
    SELLER: BASE_URL + "api/sellers",
    AGENT: BASE_URL + "api/agents",
    LISTING: BASE_URL + "api/listings",
    PROPERTY: BASE_URL + `api/properties`,
} as const;

export const API_URLS = {
    AUTH: {
        USER: (): string => API_DIRECTORY.USER + "/user",
        LOGIN: (): string => API_DIRECTORY.USER + "/login",
        REGISTER: (): string => API_DIRECTORY.USER + "/register",
        LOGOUT: (): string => API_DIRECTORY.USER + "/logout",
        VERIFY_EMAIL: (email: string): string => API_DIRECTORY.USER + "/verify-email/" + email,
        REQUEST_PASSWORD_RESET: (): string => API_DIRECTORY.USER + "/request-password-reset",
        RESET_PASSWORD: (token: string): string => API_DIRECTORY.USER + "/reset-password/" + token,
    },

    BUYER: {
        RETRIEVE: (username: string): string => API_DIRECTORY.BUYER + `/${username}`,
        EDIT: (username: string): string => API_DIRECTORY.BUYER + `/${username}`,
        WISHLIST: (username: string): string => API_DIRECTORY.BUYER + `/${username}/wishlist`,
        REMOVE_FROM_WISHLIST: (username: string, wishlistEntryPk: number): string =>
            API_DIRECTORY.BUYER + `/${username}/wishlist/${wishlistEntryPk}`,
    },

    SELLER: {
        LIST: (): string => API_DIRECTORY.SELLER + "/",
        RETRIEVE: (username: string): string => API_DIRECTORY.SELLER + `/${username}`,
        EDIT: (username: string): string => API_DIRECTORY.SELLER + `/${username}`,
    },

    AGENT: {
        LIST: (): string => API_DIRECTORY.AGENT + "/",
        RETRIEVE: (username: string): string => API_DIRECTORY.AGENT + `/${username}`,
        EDIT: (username: string): string => API_DIRECTORY.AGENT + `/${username}`,
    },

    LISTING: {
        RETRIEVE: (pk: string | number): string => API_DIRECTORY.LISTING + `/${pk}`,
        RETRIEVE_FOR_SELLER: (pk: string | number): string => API_DIRECTORY.LISTING + `/seller_account/${pk}`,
        RETRIEVE_FOR_AGENT: (pk: string | number): string => API_DIRECTORY.LISTING + `/agent_account/${pk}`,
        LIST: (searchParams?: string): string => {
            return searchParams ? API_DIRECTORY.LISTING + `/${searchParams}` : API_DIRECTORY.LISTING + "/";
        },
        LIST_FOR_SELLER: (searchParams?: string): string => {
            return searchParams
                ? API_DIRECTORY.LISTING + `/seller_account${searchParams}`
                : API_DIRECTORY.LISTING + "/seller_account";
        },
        LIST_FOR_AGENT: (searchParams?: string): string => {
            return searchParams
                ? API_DIRECTORY.LISTING + `/agent_account/${searchParams}`
                : API_DIRECTORY.LISTING + "/agent_account";
        },
        CREATE_FOR_SELLER: (): string => API_DIRECTORY.LISTING + "/seller_account",
        CREATE_FOR_AGENT: (): string => API_DIRECTORY.LISTING + "/agent_account",
        DELETE_FOR_SELLER: (pk: string | number): string => API_DIRECTORY.LISTING + `/seller_account/${pk}`,
        DELETE_FOR_AGENT: (pk: string | number): string => API_DIRECTORY.LISTING + `/agent_account"/${pk}`,
        EDIT_FOR_SELLER: (pk: string | number): string => API_DIRECTORY.LISTING + `/seller_account"/${pk}`,
        EDIT_FOR_AGENT: (pk: string | number): string => API_DIRECTORY.LISTING + `/agent_account"/${pk}`,
    },

    PROPERTY: {
        LIST: (searchParams?: string): string => {
            return searchParams ? API_DIRECTORY.PROPERTY + `/${searchParams}` : API_DIRECTORY.PROPERTY + "/";
        },
        CREATE: (): string => API_DIRECTORY.PROPERTY + "/",
        RETRIEVE: (pk: string | number): string => API_DIRECTORY.PROPERTY + `/${pk}`,
        DELETE: (pk: string | number): string => API_DIRECTORY.PROPERTY + `/${pk}`,
        EDIT: (pk: string | number): string => API_DIRECTORY.PROPERTY + `/${pk}`,
        ASSIGNED_AGENTS: (pk: string | number): string => API_DIRECTORY.PROPERTY + `/${pk}/assigned-agents`,
    },
} as const;
