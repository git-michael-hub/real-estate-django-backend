import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BuyerAccountType } from "../../../types/types";
import useBuyer from "../../../features/buyers/hooks/useBuyers";
import useAuth from "../../../features/auth/hooks/useAuth";
import NotFound from "../../NotFound";
import ListingEntry from "../../Listings/components/ListingEntry";
import BtnTab from "../../../components/Buttons/BtnTab";
import DefaultModal from "../../../components/Modal/DefaultModal";
import EditProfileForm from "./components/EditProfileForm";
import ProfileImage from "../../../components/Profile/ProfileImage";
import EditProfileBtn from "../../../components/Profile/EditProfileBtn";
import "./index.css";
import ProfileDetailsContainer from "../../../components/Profile/ProfileDetailsContainer";

export default function Profile() {
    const { username } = useParams();
    const { buyer, wishlist, fetchBuyerAndUpdateState, fetchWishlistAndUpdateState } = useBuyer();
    const { user } = useAuth();
    const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);

    useEffect(() => {
        const init = async () => {
            if (!username) return;
            await fetchBuyerAndUpdateState(username);

            if (username !== user?.username) return;
            await fetchWishlistAndUpdateState(username);
        };

        init();
    }, [username]);

    return (
        <>
            <DefaultModal isModalVisible={isEditModalVisible} setIsModalVisible={setIsEditModalVisible}>
                <EditProfileForm
                    buyer={buyer as BuyerAccountType}
                    setIsModalVisible={setIsEditModalVisible}
                ></EditProfileForm>
            </DefaultModal>

            <main id="buyer-profile-page">
                {buyer ? (
                    <div id="buyer-profile-grid-container">
                        <div>
                            <ProfileDetailsContainer>
                                <ProfileImage profile_image_path={buyer.profile_image_path}></ProfileImage>

                                <div>
                                    {user?.username === username ? (
                                        <EditProfileBtn action={setIsEditModalVisible}></EditProfileBtn>
                                    ) : (
                                        <></>
                                    )}
                                    <h2>
                                        {buyer.user.first_name} {buyer.user.last_name}
                                    </h2>
                                    <em>@{buyer.user.username}</em>
                                    <span>
                                        <i className="fa-solid fa-envelope"></i> {buyer.user.email}
                                    </span>
                                    <span>
                                        <i className="fa-regular fa-calendar"></i>Joined on {buyer.user.date_joined}
                                    </span>
                                    {buyer.bio ? <p>{buyer.bio}</p> : <></>}
                                </div>
                            </ProfileDetailsContainer>

                            {user?.username === username ? (
                                <>
                                    <div className="profile-btn-container">
                                        <BtnTab disabled>
                                            <span>Favorite Listings</span>
                                        </BtnTab>
                                    </div>
                                    <ul>
                                        {wishlist.map((wishlistEntry) => {
                                            return (
                                                <ListingEntry
                                                    listing={wishlistEntry.listing}
                                                    key={wishlistEntry.listing.id}
                                                />
                                            );
                                        })}
                                    </ul>
                                    {/* <PageBtns
                                    page={page}
                                    pages={pages}
                                    previousPageLink={previousPageLink}
                                    nextPageLink={nextPageLink}
                                    action={fetchListingsAndUpdateState}
                                ></PageBtns> */}
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                ) : (
                    <NotFound></NotFound>
                )}
            </main>
        </>
    );
}
