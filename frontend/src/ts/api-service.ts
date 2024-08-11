import cookieHandler from "./cookie-handler.ts";

const LOCALHOST_URL: string = "http://localhost:8000/";

export type HeaderType = { Authorization: string } | null;

const get = async (endpoint: string, headers: HeaderType = null) => {
    let response: Response;
    if (headers) {
        response = await fetch(LOCALHOST_URL + endpoint, {
            method: "GET",
            headers: headers,
        });
    } else {
        response = await fetch(LOCALHOST_URL + endpoint, { method: "GET" });
    }
    return response;
};

const post = async (endpoint: string, body: FormData, headers: HeaderType = null) => {
    let response: Response;
    if (headers) {
        response = await fetch(LOCALHOST_URL + endpoint, {
            method: "POST",
            headers: headers,
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
    const response: Response = await fetch(LOCALHOST_URL + endpoint, {
        method: "PATCH",
        headers: { Authorization: "Token " + cookieHandler.get("token") },
        body: body,
    });
    return response;
};

const del = async (endpoint: string) => {
    const response = await fetch(LOCALHOST_URL + endpoint, {
        method: "DELETE",
        headers: { Authorization: "Token " + cookieHandler.get("token") },
    });
    return response;
};

const apiFns = { get, post, patch, del };

export { apiFns };
