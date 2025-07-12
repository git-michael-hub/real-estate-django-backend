import { useNavigate } from "react-router-dom";
import { C_AUTH } from "../../../constants/auth";
import { AuthRole } from "../../../types/auth";
import useAgent from "../../../features/agents/hooks/useAgents";
import useBuyer from "../../../features/buyers/hooks/useBuyers";
import useSeller from "../../../features/sellers/hooks/useSellers";
import useAuth from "../../../features/auth/hooks/useAuth";
import MyRealEstateHeader from "../components/MyRealEstateHeader";
import AddAccountCard from "./components/AddAccountCard";
import "./index.css";

export default function Accounts() {
    const navigate = useNavigate();
    const { authRole, setAuthRole } = useAuth();
    const { buyer } = useBuyer();
    const { seller } = useSeller();
    const { agent } = useAgent();

    function onClickAccountCard(accountRole: AuthRole) {
        setAuthRole(accountRole);
    }

    return (
        <main id="my-accounts-page">
            <MyRealEstateHeader>
                <h2>My Accounts</h2>
            </MyRealEstateHeader>
            <section>
                <p>
                    <strong>Note:</strong>{" "}
                </p>
                <p>
                    <em>A user can only have one of each type of account {"(Buyer, Seller, and Agent Account)"}.</em>
                </p>
                <p>
                    <em>Only Seller and Agent account can access My-Real-Estate features.</em>
                </p>
                <div className="account-card" onClick={() => onClickAccountCard(C_AUTH.ACCOUNT_ROLE.BUYER)}>
                    <h3>
                        <span>Buyer Account</span>
                        {authRole === C_AUTH.ACCOUNT_ROLE.BUYER ? (
                            <span>
                                <i className="fa-solid fa-circle-check"></i>
                            </span>
                        ) : (
                            <></>
                        )}
                    </h3>
                    <div>
                        {buyer?.profile_image_path ? (
                            <img src={buyer.profile_image_path} alt="" />
                        ) : (
                            <img src={C_AUTH.DEFAULT.PROFILE_IMAGE} alt="" />
                        )}
                        <div>
                            <strong>
                                {buyer?.user.first_name} {buyer?.user.last_name}
                            </strong>
                            <span>
                                Date Joined: <em>{buyer?.user.date_joined.toString()}</em>
                            </span>
                        </div>
                    </div>
                </div>
                {seller ? (
                    <div className="account-card" onClick={() => onClickAccountCard(C_AUTH.ACCOUNT_ROLE.SELLER)}>
                        <h3>
                            <span>Seller Account</span>
                            {authRole === C_AUTH.ACCOUNT_ROLE.SELLER ? (
                                <span>
                                    <i className="fa-solid fa-circle-check"></i>
                                </span>
                            ) : (
                                <></>
                            )}
                        </h3>
                        <div>
                            {seller?.profile_image_path ? (
                                <img src={seller.profile_image_path} alt="" />
                            ) : (
                                <img src={C_AUTH.DEFAULT.PROFILE_IMAGE} alt="" />
                            )}
                            <div>
                                <strong>{seller?.business_name}</strong>
                                <span>
                                    Date Joined: <em>{seller?.user.date_joined.toString()}</em>
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <AddAccountCard onClick={() => navigate("/agents")}>Create Seller Account</AddAccountCard>
                )}

                {agent ? (
                    <div className="account-card" onClick={() => onClickAccountCard(C_AUTH.ACCOUNT_ROLE.AGENT)}>
                        <h3>
                            <span>Agent Account</span>
                            {authRole === C_AUTH.ACCOUNT_ROLE.AGENT ? (
                                <span>
                                    <i className="fa-solid fa-circle-check"></i>
                                </span>
                            ) : (
                                <></>
                            )}
                        </h3>
                        <div>
                            {agent?.profile_image_path ? (
                                <img src={agent.profile_image_path} alt="" />
                            ) : (
                                <img src={C_AUTH.DEFAULT.PROFILE_IMAGE} alt="" />
                            )}
                            <div>
                                <strong>{agent?.agent_name}</strong>
                                <span>
                                    Date Joined: <em>{agent?.user.date_joined.toString()}</em>
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <AddAccountCard onClick={() => navigate("/agents")}>Create Agent Account</AddAccountCard>
                )}
            </section>
        </main>
    );
}
