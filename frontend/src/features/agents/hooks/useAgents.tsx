import { useContext } from "react";
import AgentContext, { AgentContextType } from "../context/AgentsProvider";

const useAgent = (): AgentContextType => {
    return useContext(AgentContext);
};

export default useAgent;
