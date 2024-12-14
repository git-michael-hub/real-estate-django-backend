import BtnBasic from "../../../components/Buttons/BtnBasic";
import useAuth from "../../../features/auth/hooks/useAuth";
import useListing from "../../../features/listings/hooks/useListings";
import { useEffect, useState } from "react";
import BtnIconRound from "../../../components/Buttons/BtnIconRound";
import New from "../New";
import BtnBasicActive from "../../../components/Buttons/BtnBasicActive";
import Edit from "../Edit";
import ListingTable from "./components/ListingTable";
import ConfirmDeleteForm from "./components/ConfirmDeleteForm";
import FilterModal, { FilterOptionType } from "./components/FilterModal";
import SortDropDownBtn, { SortOptionType } from "./components/SortDropdown";
import "./index.css";

export default function Manage() {
    const [activeTab, setActiveTab] = useState<"ML" | "CL" | "EL">("ML");
    const [isDeleteFormActive, setIsDeleteFormActive] = useState<boolean>(false);
    const [deleteItem, setDeleteItem] = useState<number | null>(null);
    const [editItem, setEditItem] = useState<number | null>(null);
    const [isSortDropdownVisible, setIsSortDropdownVisible] = useState<boolean>(false);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<SortOptionType>("NTO");
    const [filterBy, setFilterBy] = useState<FilterOptionType>({
        listing_type: "",
        property_type: "",
    });
    const { user } = useAuth();
    const { fetchListingsAndUpdateState } = useListing();

    useEffect(() => {
        const init = async () => {
            await fetchListingsAndUpdateState(`?username=${user?.username}&sort_by=${sortBy}`);
        };

        init();
    }, []);

    function toggleFilterModalVisibility() {
        setIsFilterModalVisible(!isFilterModalVisible);
    }

    function onOpenDeleteForm(listingId: number) {
        setDeleteItem(listingId);
        setIsDeleteFormActive(true);
    }

    function onClickEdit(listingId: number) {
        setEditItem(listingId);
        setActiveTab("EL");
    }

    return (
        <>
            <main id="manage-listings-page">
                <div>
                    <header>
                        <h2>Manage Listings</h2>
                        <div className="row-2">
                            <nav>
                                {activeTab === "ML" ? (
                                    <>
                                        <BtnBasicActive onClick={() => setActiveTab("ML")}>My Listings</BtnBasicActive>
                                        <BtnBasic onClick={() => setActiveTab("CL")}>Create Listings</BtnBasic>
                                    </>
                                ) : activeTab === "CL" ? (
                                    <>
                                        <BtnBasic onClick={() => setActiveTab("ML")}>My Listings</BtnBasic>
                                        <BtnBasicActive onClick={() => setActiveTab("CL")}>
                                            Create Listings
                                        </BtnBasicActive>
                                    </>
                                ) : (
                                    <>
                                        <BtnBasic onClick={() => setActiveTab("ML")}>My Listings</BtnBasic>
                                        <BtnBasic onClick={() => setActiveTab("CL")}>Create Listings</BtnBasic>
                                    </>
                                )}
                            </nav>
                            {activeTab === "ML" ? (
                                <div className="option-container">
                                    <SortDropDownBtn
                                        setIsSortDropdownVisible={setIsSortDropdownVisible}
                                        setSortBy={setSortBy}
                                        sortBy={sortBy}
                                        isSortDropdownVisible={isSortDropdownVisible}
                                        filterBy={filterBy}
                                    ></SortDropDownBtn>
                                    <BtnIconRound onClick={toggleFilterModalVisibility}>
                                        <i className="fa-solid fa-filter"></i>
                                    </BtnIconRound>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </header>
                    {activeTab === "ML" ? (
                        <ListingTable onClickEdit={onClickEdit} onClickDelete={onOpenDeleteForm} />
                    ) : activeTab === "CL" ? (
                        <New></New>
                    ) : activeTab === "EL" ? (
                        <Edit listingId={editItem as number}></Edit>
                    ) : (
                        <></>
                    )}
                </div>
            </main>
            {isDeleteFormActive ? (
                <ConfirmDeleteForm listingId={deleteItem} setIsConfirmDeleteFormActive={setIsDeleteFormActive} />
            ) : (
                <></>
            )}

            {isFilterModalVisible ? (
                <FilterModal
                    setIsFilterModalVisible={setIsFilterModalVisible}
                    setFilterBy={setFilterBy}
                    sortBy={sortBy}
                    filterBy={filterBy}
                ></FilterModal>
            ) : (
                <></>
            )}
        </>
    );
}
