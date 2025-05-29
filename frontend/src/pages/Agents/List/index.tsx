import { useEffect, useState } from "react";
import { apiFns, APIResponseType } from "../../../utils/api-service";
import { AgentAccountType } from "../../../types/types";
import { Link } from "react-router-dom";
import BtnBasicActive from "../../../components/Buttons/BtnBasicActive";
import { API_URLS } from "../../../urls/api-urls";
import "./index.css";

export default function List() {
    const [agents, setAgents] = useState<AgentAccountType[]>([]);

    useEffect(() => {
        const fetchAgents = async () => {
            const response: APIResponseType = await apiFns.get(API_URLS.AGENT.LIST());
            const agents: AgentAccountType[] = response.data;
            setAgents(agents);
        };

        fetchAgents();
    }, []);

    return (
        <main id="agents-page">
            <ul id="agents-list-grid-container">
                <h2>Agents</h2>

                {agents.map((agent) => {
                    return (
                        <li key={agent.user.id} className="seller-card-container">
                            <Link to={`${agent.user.username}`}>
                                <img src={agent.profile_image_path} alt="" />
                            </Link>
                            <div>
                                <h3>
                                    <Link to={`${agent.user.username}`}>{agent.agent_name}</Link>
                                </h3>
                                <span>
                                    <em>@{agent.user.username}</em>
                                </span>
                                {agent.contact_number_1 ? (
                                    <span>
                                        <i className="fa-solid fa-phone"></i> {agent.contact_number_1}
                                    </span>
                                ) : (
                                    <></>
                                )}
                                {agent.contact_number_2 ? (
                                    <span>
                                        <i className="fa-solid fa-phone"></i> {agent.contact_number_2}
                                    </span>
                                ) : (
                                    <></>
                                )}
                                <span>
                                    <i className="fa-solid fa-envelope"></i> {agent.user.email}
                                </span>
                            </div>
                            <Link to={`${agent.user.username}`}>
                                <BtnBasicActive>Details</BtnBasicActive>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </main>
    );
}
