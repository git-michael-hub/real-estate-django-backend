import { HeaderType } from "./api-service";
import cookieHandler, { Token } from "./cookie-handler";

const createAuthorizationHeader = (): HeaderType => {
    const token: Token = cookieHandler.get("token");
    const headers: HeaderType = { Authorization: `Token ${token}` };
    return headers;
};

export const authFns = { createAuthorizationHeader };
