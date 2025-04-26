export type HeaderType = {
    Authorization: string;
    "Content-Type"?: string;
};

export type PayloadType = {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    headers?: HeaderType;
    body?: FormData | string;
};

export type APIResponseType = {
    success: boolean;
    err_messages?: Record<string, string[]>;
    data?: any;
};

const processResponse = async (api_url: string, payload: PayloadType): Promise<APIResponseType> => {
    try {
        const response: Response = await fetch(api_url, payload);
        if (response.status === 204) return { success: response.ok };
        else if (response.ok) {
            const data: any = await response.json();
            return { success: response.ok, data: data };
        } else {
            const data: any = await response.json();
            return { success: false, err_messages: data };
        }
    } catch (error) {
        console.log(error);
        const errorMessage: { error: string[] } = { error: [`An error occurred.`] };
        return { success: false, err_messages: errorMessage };
    }
};

const get = async (api_url: string, headers?: HeaderType): Promise<APIResponseType> => {
    const payload: PayloadType = { method: "GET" };
    if (headers) payload.headers = headers;
    return await processResponse(api_url, payload);
};

const post = async (api_url: string, body: FormData | string, headers?: HeaderType): Promise<APIResponseType> => {
    const payload: PayloadType = { method: "POST" };
    if (headers) payload.headers = headers;
    if (body) payload.body = body;
    return await processResponse(api_url, payload);
};

const put = async (api_url: string, body: FormData, headers?: HeaderType): Promise<APIResponseType> => {
    const payload: PayloadType = { method: "PUT", body: body };
    if (headers) payload.headers = headers;
    return await processResponse(api_url, payload);
};

const patch = async (api_url: string, body: FormData, headers?: HeaderType): Promise<APIResponseType> => {
    const payload: PayloadType = { method: "PATCH", body: body };
    if (headers) payload.headers = headers;
    return await processResponse(api_url, payload);
};

const del = async (api_url: string, headers: HeaderType): Promise<APIResponseType> => {
    const payload: PayloadType = { method: "DELETE", headers: headers };
    return await processResponse(api_url, payload);
};

const apiFns = { get, post, put, patch, del };

export { apiFns };
