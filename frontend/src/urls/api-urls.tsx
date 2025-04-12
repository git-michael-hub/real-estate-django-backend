// PRODUCTION
// const API_URL: string = "http://52.77.229.203:80/";

// DEVELOPMENT
export const BASE_URL: string = "http://localhost:8000/";
export const API_DIRECTORY = { USER: BASE_URL + "api/auth" };

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
} as const;
