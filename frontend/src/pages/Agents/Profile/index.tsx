import { useEffect, useState } from "react";
import ContactForm from "../../Listings/components/ContactForm";
import ListingEntry from "../../Listings/components/ListingEntry";
import useListing from "../../../features/listings/hooks/useListings";
import PageBtns from "../../../components/PageBtns";
import NotFound from "../../NotFound";
import { useParams } from "react-router-dom";
import ProfileImage from "../../../components/Profile/ProfileImage";
import EditProfileBtn from "../../../components/Profile/EditProfileBtn";
import useAuth from "../../../features/auth/hooks/useAuth";
import DefaultModal from "../../../components/Modal/DefaultModal";
import ProfileDetailsContainer from "../../../components/Profile/ProfileDetailsContainer";
import BtnTab from "../../../components/Buttons/BtnTab";
import useAgent from "../../../features/agents/hooks/useAgents";
import "./index.css";

export default function Profile() {
    const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
    const { username } = useParams();
    const { user } = useAuth();
    const { agent, fetchAgentAndUpdateState, setAgent } = useAgent();
    const { listings, page, pages, previousPageLink, nextPageLink, getListings } = useListing();

    useEffect(() => {
        const init = async () => {
            if (!username) return setAgent(null);
            await fetchAgentAndUpdateState(username);
            await getListings(`?agent_username=${username}`);
        };

        init();
    }, []);

    return (
        <>
            <DefaultModal isModalVisible={isEditModalVisible} setIsModalVisible={setIsEditModalVisible}></DefaultModal>

            <main id="seller-profile-page">
                {agent ? (
                    <div id="seller-profile-grid-container">
                        <div>
                            <ProfileDetailsContainer>
                                <ProfileImage profile_image_path={agent.profile_image_path}></ProfileImage>

                                <div>
                                    {user?.username === username ? (
                                        <EditProfileBtn action={setIsEditModalVisible}></EditProfileBtn>
                                    ) : (
                                        <></>
                                    )}
                                    <h2>{agent.agent_name}</h2>
                                    <em></em>
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
                                    <span>
                                        <i className="fa-regular fa-calendar"></i>Joined on{" "}
                                        {agent.date_approved?.toString()}
                                    </span>
                                    <p>{agent.bio}</p>
                                </div>
                            </ProfileDetailsContainer>
                            <div className="profile-btn-container">
                                <BtnTab disabled>
                                    <span>Listings</span>
                                </BtnTab>
                            </div>
                            {listings ? (
                                <>
                                    <ul>
                                        {listings.map((listing) => {
                                            return <ListingEntry listing={listing} key={listing.id} />;
                                        })}
                                    </ul>
                                    <PageBtns
                                        page={page}
                                        pages={pages}
                                        previousPageLink={previousPageLink}
                                        nextPageLink={nextPageLink}
                                        action={getListings}
                                    ></PageBtns>
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div>
                            <ContactForm agent_username={agent.user.username}></ContactForm>
                        </div>
                    </div>
                ) : (
                    <NotFound></NotFound>
                )}
            </main>
        </>
    );
}
