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
};

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
        RETRIEVE: (username: string): string => API_DIRECTORY.SELLER + `/${username}`,
    },

    AGENT: {
        RETRIEVE: (username: string): string => API_DIRECTORY.AGENT + `/${username}`,
    },

    LISTING: {
        SEARCH: (searchParams?: string): string => {
            return searchParams ? API_DIRECTORY.LISTING + `/${searchParams}` : API_DIRECTORY.LISTING + "/";
        },
        RETRIEVE: (pk: string | number): string => API_DIRECTORY.LISTING + `/${pk}`,
    },
} as const;
