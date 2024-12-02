const LOCALHOST_URL: string = "http://localhost:8000/";

export type HeaderType = { Authorization: string; "Content-Type"?: string };
export type PayloadType = {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    headers?: HeaderType;
    body?: FormData | string;
};

export type APIResponseType = { success: boolean; data?: any };

const processResponse = async (endpoint: string, payload: PayloadType): Promise<APIResponseType> => {
    const response: Response = await fetch(LOCALHOST_URL + endpoint, payload);
    if (response.status === 204) return { success: response.ok };
    const data: any = await response.json();
    return { success: response.ok, data: data };
};

const get = async (endpoint: string, headers?: HeaderType): Promise<APIResponseType> => {
    const payload: PayloadType = { method: "GET" };
    if (headers) payload.headers = headers;
    return await processResponse(endpoint, payload);
};

const post = async (endpoint: string, body: FormData | string, headers?: HeaderType): Promise<APIResponseType> => {
    const payload: PayloadType = { method: "POST" };
    if (headers) payload.headers = headers;
    if (body) payload.body = body;
    return await processResponse(endpoint, payload);
};

const put = async (endpoint: string, body: FormData, headers: HeaderType): Promise<APIResponseType> => {
    const payload: PayloadType = { method: "PUT", body: body, headers: headers };
    return await processResponse(endpoint, payload);
};

const patch = async (endpoint: string, body: FormData, headers: HeaderType): Promise<APIResponseType> => {
    const payload: PayloadType = { method: "PATCH", body: body, headers: headers };
    return await processResponse(endpoint, payload);
};

const del = async (endpoint: string, headers: HeaderType): Promise<APIResponseType> => {
    const payload: PayloadType = { method: "DELETE", headers: headers };
    return await processResponse(endpoint, payload);
};

const apiFns = { get, post, put, patch, del };

export { apiFns };
