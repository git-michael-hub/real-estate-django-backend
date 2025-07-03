import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { C_PROPERTIES } from "../../../constants/properties";
import { PropertySortOptionType } from "../../../types/property";
import useProperty from "../../../features/properties/hooks/useProperties";
import Spinner from "../../../components/Spinner";
import BtnIconNoBg from "../../../components/Buttons/BtnIconNoBg";
import BtnBasicActive from "../../../components/Buttons/BtnBasicActive";
import BtnIconRound from "../../../components/Buttons/BtnIconRound";
import MyRealEstateHeader from "../components/MyRealEstateHeader";
import ConfirmDeleteForm from "../components/ConfirmDeleteForm";
import FilterModal from "../components/FilterModal";
import "./index.css";

export default function Properties() {
    const [isLoadingComplete, setIsLoadingComplete] = useState<boolean>(false);
    const [isSortDropdownVisible, setIsSortDropdownVisible] = useState<boolean>(false);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);
    const [isConfirmDeleteFormActive, setIsConfirmDeleteFormActive] = useState<boolean>(false);
    const [deletePropertyId, setDeletePropertyId] = useState<number | string | null>(null);
    const [params, setParams] = useState<URLSearchParams>(
        new URLSearchParams({ sort_by: C_PROPERTIES.SORT.OPTIONS.NEW_TO_OLD.value })
    );
    const dropDownRef = useRef<HTMLUListElement>(null);
    const navigate = useNavigate();
    const { properties, fetchPropertiesAndUpdateState, deleteProperty, setProperties } = useProperty();

    useEffect(() => {
        const init = async () => {
            await fetchPropertiesAndUpdateState(`?${params.toString()}`);
            for (let i = 0; i < 1000000000; i++) {
                1 + 1;
            }
            setIsLoadingComplete(true);
        };

        init();
    }, []);

    async function sortProperties(sortOption: PropertySortOptionType) {
        const newParams = new URLSearchParams(params.toString());
        newParams.set("sort_by", sortOption);
        setParams(newParams);
        await fetchPropertiesAndUpdateState(`?${newParams.toString()}`);
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

    function toNewProperties(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        navigate("/my-real-estate/properties/new");
    }

    function toEditProperty(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const propertyId = e.currentTarget.value;
        navigate(`/my-real-estate/properties/${propertyId}/edit`, { state: { propertyId: propertyId } });
    }

    function onClickDeleteBtn(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setIsConfirmDeleteFormActive(true);
        setDeletePropertyId(e.currentTarget.value);
    }

    function deleteCallback() {
        const newProperties = properties.filter((property) => {
            if (property.id.toString() !== deletePropertyId) return property;
        });
        setProperties([...newProperties]);
    }

    return (
        <>
            <main id="my-properties-page">
                <MyRealEstateHeader>
                    <h2>My Properties</h2>
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
                                    {C_PROPERTIES.SORT.OPTIONS_LIST.map((sortOption, index) => {
                                        return (
                                            <li key={index} onClick={() => sortProperties(sortOption.value)}>
                                                <span>{sortOption.text}</span>{" "}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <></>
                            )}
                        </div>
                        <BtnBasicActive onClick={toNewProperties}>+ Add Property</BtnBasicActive>
                    </div>
                </MyRealEstateHeader>
                <section>
                    <header>
                        <input type="checkbox" />
                        <h3>Image</h3>
                        <h3>Address</h3>
                        <h3>Property Type</h3>
                        <h3>Status</h3>
                        <h3>Date Added</h3>
                        <div></div>
                    </header>

                    {isLoadingComplete ? (
                        <section className="property-list">
                            {properties.map((property) => (
                                <div key={property.id} className="property-list-item">
                                    <input type="checkbox" />
                                    <img src={property.image1_path} alt="" />
                                    <address>
                                        <Link to={`${property.id}`}>{property.address}</Link>
                                    </address>
                                    <span>{property.property_type_display}</span>
                                    <span>{property.status_display}</span>
                                    <span>{property.date_created.toString()}</span>
                                    <div className="btn-container">
                                        <BtnIconNoBg title="Edit" value={property.id} onClick={toEditProperty}>
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </BtnIconNoBg>
                                        <BtnIconNoBg title="Delete" value={property.id} onClick={onClickDeleteBtn}>
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
                    objectId={deletePropertyId}
                    deleteFunction={deleteProperty}
                    callback={deleteCallback}
                ></ConfirmDeleteForm>
            )}

            {isFilterModalVisible && (
                <FilterModal
                    setIsFilterModalVisible={setIsFilterModalVisible}
                    params={params}
                    setParams={setParams}
                ></FilterModal>
            )}
        </>
    );
}
