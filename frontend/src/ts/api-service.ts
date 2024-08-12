const LOCALHOST_URL: string = "http://localhost:8000/";

export type HeaderType = { Authorization: string };
export type PayloadType = {
    method: "GET" | "POST" | "PATCH" | "DELETE";
    headers?: HeaderType;
    body?: FormData;
};

const get = async (endpoint: string, headers?: HeaderType): Promise<Response> => {
    const payload: PayloadType = { method: "GET" };
    if (headers) payload.headers = headers;
    const response: Response = await fetch(LOCALHOST_URL + endpoint, payload);
    return response;
};

const post = async (endpoint: string, body?: FormData, headers?: HeaderType): Promise<Response> => {
    const payload: PayloadType = { method: "POST" };
    if (headers) payload.headers = headers;
    if (body) payload.body = body;
    const response: Response = await fetch(LOCALHOST_URL + endpoint, payload);
    return response;
};

const patch = async (endpoint: string, body: FormData, headers: HeaderType): Promise<Response> => {
    const payload: PayloadType = { method: "PATCH", body: body, headers: headers };
    const response: Response = await fetch(LOCALHOST_URL + endpoint, payload);
    return response;
};

const del = async (endpoint: string, headers: HeaderType): Promise<Response> => {
    const payload: PayloadType = { method: "DELETE", headers: headers };
    const response: Response = await fetch(LOCALHOST_URL + endpoint, payload);
    return response;
};

const apiFns = { get, post, patch, del };

export { apiFns };
