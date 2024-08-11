import cookieHandler from "./cookie-handler.ts";

const LOCALHOST_URL: string = "http://localhost:8000/";
const API_URL: string = LOCALHOST_URL + "api/";

const get = async (endpoint: string) => {
    const response: Response = await fetch(API_URL + endpoint, { method: "GET" });
    const data: JSON = await response.json();
    return data;
};

const post = async (endpoint: string, body: FormData, headers: { Authorization: string } | null = null) => {
    let response: Response;
    if (headers) {
        response = await fetch(LOCALHOST_URL + endpoint, {
            method: "POST",
            headers: { Authorization: "Token " + cookieHandler.get("token") },
            body: body,
        });
    } else {
        response = await fetch(LOCALHOST_URL + endpoint, {
            method: "POST",
            body: body,
        });
    }
    return response;
};

const patch = async (endpoint: string, body: FormData) => {
    const response: Response = await fetch(API_URL + endpoint, {
        method: "PATCH",
        headers: { Authorization: "Token " + cookieHandler.get("token") },
        body: body,
    });
    const data = await response.json();
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

const apiFns = { get, post, patch, del };

export { apiFns };
