import { useEffect, useState } from "react";
import useBuyer from "../../../features/buyers/hooks/useBuyers";
import "./index.css";
import { useParams } from "react-router-dom";
import useAuth from "../../../features/auth/hooks/useAuth";
import ListingEntry from "../../Listings/components/ListingEntry";
import NotFound from "../../NotFound";
import BtnTab from "../../../components/Buttons/BtnTab";
import BtnBasicActive from "../../../components/Buttons/BtnBasicActive";
import BtnLink from "../../../components/Buttons/BtnLink";
import DefaultModal from "../../../components/Modal/DefaultModal";
import EditProfileForm from "./components/EditProfileForm";
import { BuyerAccountType } from "../../../types/types";

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
                    <>
                        <div id="buyer-profile-grid-container">
                            <div>
                                <section id="buyer-profile-details-container">
                                    {buyer.profile_image_path ? (
                                        <img src={buyer.profile_image_path} alt="" />
                                    ) : (
                                        <img
                                            src="/static/images/default-profile-picture.jpg"
                                            alt="Photo by Muhammad Khaleeq on https://www.vecteezy.com/vector-art/288638-broker-vector-icon"
                                            className="default-profile-picture"
                                        />
                                    )}

                                    <div>
                                        {user?.username === username ? (
                                            <>
                                                <BtnBasicActive
                                                    id="edit-profile-btn"
                                                    onClick={() => setIsEditModalVisible(true)}
                                                >
                                                    <span>Edit</span>
                                                </BtnBasicActive>
                                                <BtnLink
                                                    id="edit-profile-btn-link"
                                                    onClick={() => setIsEditModalVisible(true)}
                                                >
                                                    <span>Edit</span>
                                                </BtnLink>
                                            </>
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
                                </section>

                                {user?.username === username ? (
                                    <>
                                        <div id="buyer-profile-btn-container">
                                            <BtnTab id="fav-listing-btn">
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
                    </>
                ) : (
                    <NotFound></NotFound>
                )}
            </main>
        </>
    );
}
