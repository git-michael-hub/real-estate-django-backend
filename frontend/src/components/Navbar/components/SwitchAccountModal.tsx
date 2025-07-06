import { AuthRole } from "../../../types/auth";
import { C_AUTH } from "../../../constants/auth";
import useAuth from "../../../features/auth/hooks/useAuth";
import useBuyer from "../../../features/buyers/hooks/useBuyers";
import useSeller from "../../../features/sellers/hooks/useSellers";
import useAgent from "../../../features/agents/hooks/useAgents";
import DefaultModal from "../../Modal/DefaultModal";

type SwitchAccountModalType = {
    isModalVisible: boolean;
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function SwitchAccountModal({ isModalVisible, setIsModalVisible }: SwitchAccountModalType) {
    const { setAuthRole, getAuthRole } = useAuth();
    const { buyer } = useBuyer();
    const { seller } = useSeller();
    const { agent } = useAgent();

    function onClickModal(role: AuthRole) {
        setAuthRole(role);
        window.location.reload();
    }

    return (
        <DefaultModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}>
            <div onClick={() => onClickModal(C_AUTH.ACCOUNT_ROLE.BUYER)}>
                {buyer?.profile_image_path ? (
                    <img src={buyer?.profile_image_path.toString()} alt="" className="profile-image-round" />
                ) : (
                    <img src="/static/images/default-profile-picture.jpg" alt="" className="profile-image-round" />
                )}
                <div>
                    <div>
                        <strong>
                            {buyer?.user.first_name} {buyer?.user.last_name}
                        </strong>
                        <span>{C_AUTH.ACCOUNT_ROLE.BUYER} account</span>
                    </div>
                    {getAuthRole() === "buyer" ? <span>Active</span> : <></>}
                </div>
            </div>
            {seller ? (
                <div onClick={() => onClickModal(C_AUTH.ACCOUNT_ROLE.SELLER)}>
                    {seller.profile_image_path ? (
                        <img src={seller?.profile_image_path.toString()} alt="" className="profile-image-round" />
                    ) : (
                        <img src="/static/images/default-profile-picture.jpg" alt="" className="profile-image-round" />
                    )}
                    <div>
                        <div>
                            <strong>{seller?.business_name}</strong>
                            <span>{C_AUTH.ACCOUNT_ROLE.SELLER} account</span>
                        </div>
                        {getAuthRole() === "seller" ? <span>Active</span> : <></>}
                    </div>
                </div>
            ) : (
                <></>
            )}

            {agent ? (
                <div onClick={() => onClickModal(C_AUTH.ACCOUNT_ROLE.AGENT)}>
                    {agent.profile_image_path ? (
                        <img src={agent?.profile_image_path.toString()} alt="" className="profile-image-round" />
                    ) : (
                        <img src="/static/images/default-profile-picture.jpg" alt="" className="profile-image-round" />
                    )}
                    <div>
                        <div>
                            <strong>{agent?.agent_name}</strong>
                            <span>{C_AUTH.ACCOUNT_ROLE.AGENT} account</span>
                        </div>
                        {getAuthRole() === "agent" ? <span>Active</span> : <></>}
                    </div>
                </div>
            ) : (
                <></>
            )}
        </DefaultModal>
    );
}
