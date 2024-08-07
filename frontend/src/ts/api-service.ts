import cookieHandler from "./cookie-handler.ts";

const LOCALHOST_URL: string = "http://localhost:8000/";
const API_URL: string = LOCALHOST_URL + "api/";
const LOGIN_URL: string = LOCALHOST_URL + "user/login";
const REGISTER_URL: string = LOCALHOST_URL + "user/register";

const get = async (endpoint: string) => {
    const response: Response = await fetch(API_URL + endpoint, { method: "GET" });
    const data: JSON = await response.json();
    return data;
};

const post = async (endpoint: string, body: FormData) => {
    const response: Response = await fetch(API_URL + endpoint, {
        method: "POST",
        headers: { Authorization: "Token " + cookieHandler.get("token") },
        body: body,
    });
    const data: object = await response.json();
    if (response.ok) return { isSuccess: response.ok, data: data };
    return { isSuccess: response.ok, errors: data };
};

const patch = async (endpoint: string, body: FormData) => {
    const response: Response = await fetch(API_URL + endpoint, {
        method: "PATCH",
        headers: { Authorization: "Token " + cookieHandler.get("token") },
        body: body,
    });
    const data: object = await response.json();
    if (response.ok) return { isSuccess: response.ok, data: data };
    return { isSuccess: response.ok, errors: data };
};

const del = async (endpoint: string) => {
    const response = await fetch(API_URL + endpoint, {
        method: "DELETE",
        headers: { Authorization: "Token " + cookieHandler.get("token") },
    });
    if (response.ok) return { isSuccess: response.ok, message: "Delete request successful." };
    const errors = await response.json();
    return { isSuccess: response.ok, errors: errors };
};

const login = async (body: FormData) => {
    const response = await fetch(LOGIN_URL, {
        method: "POST",
        body: body,
    });
    const data = await response.json();
    if (response.ok) {
        cookieHandler.set("token", data.token);
        return { isSuccess: response.ok, message: "Login success!" };
    }
    return { isSuccess: response.ok, message: "Invalid credentials." };
};

const register = async (body: FormData) => {
    const response = await fetch(REGISTER_URL, {
        method: "POST",
        body: body,
        redirect: "follow",
    });
    if (response.ok) return { isSuccess: response.ok, message: "Registration complete!" };
    const errors: object = await response.json();
    return { isSuccess: response.ok, errors: errors };
};

const apiFns = { get, post, patch, del, login, register };

export { apiFns };
