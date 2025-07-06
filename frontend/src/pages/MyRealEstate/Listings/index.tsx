import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { C_LISTINGS } from "../../../constants/listings";
import { C_AUTH } from "../../../constants/auth";
import { ListingSortOptionDisplayType, ListingSortOptionType } from "../../../types/listing";
import useAuth from "../../../features/auth/hooks/useAuth";
import useListing from "../../../features/listings/hooks/useListings";
import helperFn from "../../../utils/form-utils";
import Spinner from "../../../components/Spinner";
import MyRealEstateHeader from "../components/MyRealEstateHeader";
import BtnIconNoBg from "../../../components/Buttons/BtnIconNoBg";
import ConfirmDeleteForm from "../components/ConfirmDeleteForm";
import BtnIconRound from "../../../components/Buttons/BtnIconRound";
import BtnBasicActive from "../../../components/Buttons/BtnBasicActive";
import ListingFilterModal from "../components/ListingFIlterModal";
import "./index.css";

export default function Listings() {
    const [isLoadingComplete, setIsLoadingComplete] = useState<boolean>(false);
    const [isConfirmDeleteFormActive, setIsConfirmDeleteFormActive] = useState<boolean>(false);
    const [deleteListingId, setDeleteListingId] = useState<number | string | null>(null);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);
    const [isSortDropdownVisible, setIsSortDropdownVisible] = useState<boolean>(false);
    const [params, setParams] = useState<URLSearchParams>(
        new URLSearchParams({ sort_by: C_LISTINGS.SORT_OPTIONS.NEW_TO_OLD.value })
    );
    const {
        listings,
        getListingsForSeller,
        getListingsForAgent,
        deleteListingForSeller,
        deleteListingForAgent,
        setListings,
    } = useListing();
    const { getAuthRole } = useAuth();
    const dropDownRef = useRef<HTMLUListElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const init = async () => {
            if (getAuthRole() === C_AUTH.ACCOUNT_ROLE.AGENT) {
                await getListingsForAgent();
                console.log("get for agent");
            }
            if (getAuthRole() === C_AUTH.ACCOUNT_ROLE.SELLER) {
                await getListingsForSeller();
                console.log("get for seller");
            }
            for (let i = 0; i < 1000000000; i++) {
                1 + 1;
            }
            setIsLoadingComplete(true);
        };

        init();
    }, []);

    async function sortListings(sortOption: ListingSortOptionType) {
        const newParams = new URLSearchParams(params.toString());
        newParams.set("sort_by", sortOption);
        setParams(newParams);
        if (getAuthRole() === C_AUTH.ACCOUNT_ROLE.AGENT) await getListingsForAgent(`?${newParams.toString()}`);
        if (getAuthRole() === C_AUTH.ACCOUNT_ROLE.SELLER) await getListingsForSeller(`?${newParams.toString()}`);
        setIsSortDropdownVisible(false);
    }

    function toggleSortDropdownVisibility(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        const newVisibility = !isSortDropdownVisible;

        if (newVisibility) {
            setIsSortDropdownVisible(true);
            document.addEventListener("click", handleClickOutside);
        } else {
            setIsSortDropdownVisible(false);
            document.removeEventListener("click", handleClickOutside);
        }
    }

    function handleClickOutside(e: MouseEvent) {
        if (dropDownRef.current && !dropDownRef.current.contains(e.target as Node)) {
            setIsSortDropdownVisible(false);
            document.removeEventListener("click", handleClickOutside);
        }
    }

    function toEditListing(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const listingId = e.currentTarget.value;
        navigate(`/my-real-estate/listings/${listingId}/edit`, { state: { listingId: listingId } });
    }

    function onClickDeleteBtn(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setIsConfirmDeleteFormActive(true);
        setDeleteListingId(e.currentTarget.value);
    }

    function deleteCallback() {
        const newListings = listings.filter((listing) => {
            if (listing.id.toString() !== deleteListingId) return listing;
        });
        setListings([...newListings]);
    }

    async function deleteListing(objectId: string | number) {
        if (getAuthRole() === C_AUTH.ACCOUNT_ROLE.AGENT) return await deleteListingForAgent(objectId);
        if (getAuthRole() === C_AUTH.ACCOUNT_ROLE.SELLER) return await deleteListingForSeller(objectId);
        return false;
    }

    function toNewListings(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        navigate("/my-real-estate/listings/new", { state: { propertyId: "" } });
    }

    return (
        <>
            <main id="my-listings-page">
                <MyRealEstateHeader>
                    <h2>My Listings</h2>
                    <div>
                        <div>
                            <BtnIconRound onClick={() => setIsFilterModalVisible(true)} title="Filter">
                                <i className="fa-solid fa-filter"></i>
                            </BtnIconRound>
                        </div>
                        <div id="property-dropdown">
                            <BtnIconRound onClick={toggleSortDropdownVisibility} title="Sort">
                                <i className="fa-solid fa-arrow-up-wide-short"></i>
                            </BtnIconRound>
                            {isSortDropdownVisible ? (
                                <ul className="dropdown" ref={dropDownRef}>
                                    {(
                                        Object.entries(C_LISTINGS.SORT_OPTIONS) as [
                                            keyof typeof C_LISTINGS.SORT_OPTIONS,
                                            { text: ListingSortOptionDisplayType; value: ListingSortOptionType }
                                        ][]
                                    ).map(([, sortOption]) => {
                                        return (
                                            <li onClick={() => sortListings(sortOption.value)}>
                                                <span>{sortOption.text}</span>{" "}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <></>
                            )}
                        </div>
                        <BtnBasicActive onClick={toNewListings}>+ Add Listing</BtnBasicActive>
                    </div>
                </MyRealEstateHeader>
                <section>
                    <header>
                        <input type="checkbox" />
                        <h3>Image</h3>
                        <h3>Title</h3>
                        <h3>Listing Type</h3>
                        <h3>Price</h3>
                        <h3>Status</h3>
                        <h3>Date Added</h3>
                    </header>

                    {isLoadingComplete ? (
                        <section className="listing-list">
                            {listings.map((listing) => (
                                <div key={listing.id} className="listing-list-item">
                                    <input type="checkbox" />
                                    <img src={listing.property.image1_path} alt="" />
                                    <em className="listing-title">
                                        <Link to={`/listings/${listing.id}`}>{listing.title}</Link>
                                    </em>
                                    <address>{listing.listing_type_display}</address>
                                    {listing.listing_type === C_LISTINGS.TYPES.FOR_RENT.value ? (
                                        <span>Php {helperFn.insertComma(listing.price)} / mo.</span>
                                    ) : (
                                        <span>Php {helperFn.insertComma(listing.price)}</span>
                                    )}
                                    <span>{listing.status_display}</span>
                                    <span>{listing.created_at.toString()}</span>
                                    <div className="btn-container">
                                        <BtnIconNoBg title="Edit" value={listing.id} onClick={toEditListing}>
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </BtnIconNoBg>
                                        <BtnIconNoBg title="Delete" value={listing.id} onClick={onClickDeleteBtn}>
                                            <i className="fa-solid fa-trash"></i>
                                        </BtnIconNoBg>
                                    </div>
                                </div>
                            ))}
                        </section>
                    ) : (
                        <Spinner></Spinner>
                    )}
                </section>
            </main>
            {isConfirmDeleteFormActive && (
                <ConfirmDeleteForm
                    setIsConfirmDeleteFormActive={setIsConfirmDeleteFormActive}
                    objectId={deleteListingId}
                    deleteFunction={deleteListing}
                    callback={deleteCallback}
                ></ConfirmDeleteForm>
            )}
            {isFilterModalVisible && (
                <ListingFilterModal
                    setIsFilterModalVisible={setIsFilterModalVisible}
                    params={params}
                    setParams={setParams}
                ></ListingFilterModal>
            )}
        </>
    );
}
