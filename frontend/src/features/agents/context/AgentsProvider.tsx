import { createContext, useState } from "react";
import { apiFns, APIResponseType, HeaderType } from "../../../utils/api-service";
import cookieHandler, { Token } from "../../../utils/cookie-handler";
import { API_URLS } from "../../../urls/api-urls";
import { AgentAccountType } from "../../../types/types";

type ChildrenType = { children?: React.ReactElement | React.ReactElement[] };

export const AgentsProvider = ({ children }: ChildrenType) => {
    const [agent, setAgent] = useState<AgentAccountType | null>(null);

    const fetchAgent = async (username: string): Promise<AgentAccountType | null> => {
        const response: APIResponseType = await apiFns.get(API_URLS.AGENT.RETRIEVE(username));
        if (response.success) return response.data as AgentAccountType;
        console.log(response.err_messages);
        return null;
    };

    const fetchAgentAndUpdateState = async (username: string): Promise<AgentAccountType | null> => {
        const agent: AgentAccountType | null = await fetchAgent(username);
        setAgent(agent);
        return agent;
    };

    const editProfile = async (username: string, formData: FormData): Promise<APIResponseType> => {
        const token: Token = cookieHandler.get("token");
        const headers: HeaderType = { Authorization: `Token ${token}` };
        const response: APIResponseType = await apiFns.patch(API_URLS.AGENT.EDIT(username), formData, headers);
        if (!response.success) console.log(response.err_messages);
        return response;
    };

    const editProfileAndUpdateState = async (username: string, formData: FormData): Promise<APIResponseType> => {
        const response: APIResponseType = await editProfile(username, formData);
        if (response.success) setAgent(response.data as AgentAccountType);
        return response;
    };

    return (
        <agentContext.Provider
            value={{
                agent,
                setAgent,
                fetchAgent,
                fetchAgentAndUpdateState,
                editProfile,
                editProfileAndUpdateState,
            }}
        >
            {children}
        </agentContext.Provider>
    );
};

export type AgentContextType = {
    agent: AgentAccountType | null;
    setAgent: React.Dispatch<React.SetStateAction<AgentAccountType | null>>;
    fetchAgent: (username: string) => Promise<AgentAccountType | null>;
    fetchAgentAndUpdateState: (username: string) => Promise<AgentAccountType | null>;
    editProfile: (username: string, formData: FormData) => Promise<APIResponseType>;
    editProfileAndUpdateState: (username: string, formData: FormData) => Promise<APIResponseType>;
};

const initAgentContextState: AgentContextType = {
    agent: null,
    setAgent: () => null,
    fetchAgent: () => Promise.resolve(null),
    fetchAgentAndUpdateState: () => Promise.resolve(null),
    editProfile: () => Promise.resolve({ success: false }),
    editProfileAndUpdateState: () => Promise.resolve({ success: false }),
};

const agentContext = createContext<AgentContextType>(initAgentContextState);

export default agentContext;
