import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ContactForm from "../../Listings/components/ContactForm";
import ListingEntry from "../../Listings/components/ListingEntry";
import useListing from "../../../features/listings/hooks/useListings";
import PageBtns from "../../../components/PageBtns";
import NotFound from "../../NotFound";
import useSeller from "../../../features/sellers/hooks/useSellers";
import ProfileImage from "../../../components/Profile/ProfileImage";
import EditProfileBtn from "../../../components/Profile/EditProfileBtn";
import useAuth from "../../../features/auth/hooks/useAuth";
import DefaultModal from "../../../components/Modal/DefaultModal";
import ProfileDetailsContainer from "../../../components/Profile/ProfileDetailsContainer";
import BtnTab from "../../../components/Buttons/BtnTab";
import "./index.css";

export default function Profile() {
    const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
    const [tabState, setTabState] = useState({ listings: true, properties: false });
    const { username } = useParams();
    const { user } = useAuth();
    const { seller, fetchSellerAndUpdateState, setSeller } = useSeller();
    const { listings, page, pages, previousPageLink, nextPageLink, getListings } = useListing();

    useEffect(() => {
        const init = async () => {
            if (!username) return setSeller(null);
            await fetchSellerAndUpdateState(username);
            await getListings(`?seller_username=${username}`);
        };

        init();
    }, []);

    function onClickTab(e: React.MouseEvent<HTMLButtonElement>, tabState: { listings: boolean; properties: boolean }) {
        e.preventDefault();
        setTabState(tabState);
    }

    return (
        <>
            <DefaultModal isModalVisible={isEditModalVisible} setIsModalVisible={setIsEditModalVisible}></DefaultModal>

            <main id="seller-profile-page">
                {seller ? (
                    <div id="seller-profile-grid-container">
                        <div>
                            <ProfileDetailsContainer>
                                <ProfileImage profile_image_path={seller.profile_image_path}></ProfileImage>

                                <div>
                                    {user?.username === username ? (
                                        <EditProfileBtn action={setIsEditModalVisible}></EditProfileBtn>
                                    ) : (
                                        <></>
                                    )}
                                    <h2>{seller.business_name}</h2>
                                    <em></em>
                                    <span>
                                        <i className="fa-solid fa-phone"></i> {seller.contact_number_1}
                                    </span>
                                    {seller.contact_number_2 ? (
                                        <span>
                                            <i className="fa-solid fa-phone"></i> {seller.contact_number_2}
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                    <span title={seller.user.email}>
                                        <i className="fa-solid fa-envelope"></i> {seller.user.email}
                                    </span>
                                    <span>
                                        <i className="fa-regular fa-calendar"></i>Joined on{" "}
                                        {seller.date_approved.toString()}
                                    </span>
                                    <p>{seller.description}</p>
                                </div>
                            </ProfileDetailsContainer>
                            <div className="profile-btn-container">
                                <BtnTab
                                    disabled={tabState.listings}
                                    onClick={(e) => onClickTab(e, { listings: true, properties: false })}
                                >
                                    <span>Listings</span>
                                </BtnTab>
                                <BtnTab
                                    disabled={tabState.properties}
                                    onClick={(e) => onClickTab(e, { listings: false, properties: true })}
                                >
                                    <span>Properties</span>
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
                            <ContactForm seller_username={seller.user.username}></ContactForm>
                        </div>
                    </div>
                ) : (
                    <NotFound></NotFound>
                )}
            </main>
        </>
    );
}
