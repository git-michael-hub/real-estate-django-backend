import { useRef } from "react";
import BtnLink from "../../../../../components/Buttons/BtnLink";
import useAuth from "../../../../../features/auth/hooks/useAuth";
import useListing from "../../../../../features/listings/hooks/useListings";
import { SortOptionType } from "../SortDropdown";
import "./index.css";

export type FilterOptionType = {
    listing_type: "FS" | "FR" | "FC" | "";
    property_type: "HL" | "CO" | "RL" | "CL" | "";
    is_available?: "True" | "False";
};

type FilterModalProps = {
    setIsFilterModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setFilterBy: React.Dispatch<React.SetStateAction<FilterOptionType>>;
    sortBy: SortOptionType;
    filterBy: FilterOptionType;
};

export default function FilterModal({ setIsFilterModalVisible, setFilterBy, sortBy, filterBy }: FilterModalProps) {
    const listingTypeRefs = useRef<(HTMLInputElement | null)[]>([]);
    const propertyTypeRefs = useRef<(HTMLInputElement | null)[]>([]);
    const availabilityRefs = useRef<(HTMLInputElement | null)[]>([]);
    const { user } = useAuth();
    const { fetchListingsAndUpdateState } = useListing();

    function closeModal() {
        setIsFilterModalVisible(false);
    }

    async function onClickListingType(listingType: "FS" | "FR" | "FC" | "") {
        let params = `?username=${user?.username}&sort_by=${sortBy}&listing_type=${listingType}&property_type=${filterBy.property_type}`;
        if (filterBy.is_available) params = params + `&is_available=${filterBy.is_available}`;
        await fetchListingsAndUpdateState(params);
        setFilterBy({ ...filterBy, listing_type: listingType });
    }

    async function onClickPropertyType(propertyType: "HL" | "CO" | "RL" | "CL" | "") {
        let params = `?username=${user?.username}&sort_by=${sortBy}&listing_type=${filterBy.listing_type}&property_type=${propertyType}`;
        if (filterBy.is_available) params = params + `&is_available=${filterBy.is_available}`;
        await fetchListingsAndUpdateState(params);
        setFilterBy({ ...filterBy, property_type: propertyType });
    }

    async function onClickAvailability(availability: "True" | "False") {
        let params = `?username=${user?.username}&sort_by=${sortBy}&listing_type=${filterBy.listing_type}&property_type=${filterBy.property_type}`;
        if (availability) params = params + `&is_available=${availability}`;
        await fetchListingsAndUpdateState(params);
        setFilterBy({ ...filterBy, is_available: availability });
    }

    async function onClearFilters() {
        listingTypeRefs.current.forEach((el) => {
            if (el) el.checked = false;
        });
        propertyTypeRefs.current.forEach((el) => {
            if (el) el.checked = false;
        });
        availabilityRefs.current.forEach((el) => {
            if (el) el.checked = false;
        });
        await fetchListingsAndUpdateState(`?username=${user?.username}&sort_by=${sortBy}`);
        setFilterBy({ listing_type: "", property_type: "" });
    }

    return (
        <div id="filter-modal-background-mask">
            <section id="filter-modal">
                <BtnLink onClick={closeModal}>close</BtnLink>
                <div>
                    <b>Listing Type</b>

                    <div>
                        <input
                            type="radio"
                            name="listing_type"
                            id="FS"
                            onClick={() => onClickListingType("FS")}
                            ref={(el) => (listingTypeRefs.current[0] = el)}
                            defaultChecked={filterBy.listing_type === "FS" ? true : false}
                        />
                        <label htmlFor="FS">For Sale</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="listing_type"
                            id="FR"
                            onClick={() => onClickListingType("FR")}
                            ref={(el) => (listingTypeRefs.current[1] = el)}
                            defaultChecked={filterBy.listing_type === "FR" ? true : false}
                        />
                        <label htmlFor="FR">For Rent</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="listing_type"
                            id="FC"
                            onClick={() => onClickListingType("FC")}
                            ref={(el) => (listingTypeRefs.current[2] = el)}
                            defaultChecked={filterBy.listing_type === "FC" ? true : false}
                        />
                        <label htmlFor="FC">Foreclosure</label>
                    </div>
                </div>

                <div>
                    <b>Property Type</b>
                    <div>
                        <input
                            type="radio"
                            name="property_type"
                            id="HL"
                            onClick={() => onClickPropertyType("HL")}
                            ref={(el) => (propertyTypeRefs.current[0] = el)}
                            defaultChecked={filterBy.property_type === "HL" ? true : false}
                        />
                        <label htmlFor="HL">House and Lot</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="property_type"
                            id="CO"
                            onClick={() => onClickPropertyType("CO")}
                            ref={(el) => (propertyTypeRefs.current[1] = el)}
                            defaultChecked={filterBy.property_type === "CO" ? true : false}
                        />
                        <label htmlFor="CO">Condominium</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="property_type"
                            id="RL"
                            onClick={() => onClickPropertyType("RL")}
                            ref={(el) => (propertyTypeRefs.current[2] = el)}
                            defaultChecked={filterBy.property_type === "RL" ? true : false}
                        />
                        <label htmlFor="RL">Residential Lot</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="property_type"
                            id="CL"
                            onClick={() => onClickPropertyType("CL")}
                            ref={(el) => (propertyTypeRefs.current[3] = el)}
                            defaultChecked={filterBy.property_type === "CL" ? true : false}
                        />
                        <label htmlFor="CL">Commercial Lot</label>
                    </div>
                </div>

                <div>
                    <b>Availability</b>
                    <div>
                        <input
                            type="radio"
                            name="is_available"
                            id="available"
                            onClick={() => onClickAvailability("True")}
                            ref={(el) => (availabilityRefs.current[0] = el)}
                            defaultChecked={filterBy.is_available === "True" ? true : false}
                        />
                        <label htmlFor="available">Available</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="is_available"
                            id="not_available"
                            onClick={() => onClickAvailability("False")}
                            ref={(el) => (availabilityRefs.current[1] = el)}
                            defaultChecked={filterBy.is_available === "False" ? true : false}
                        />
                        <label htmlFor="not_available">Not Available</label>
                    </div>
                </div>
                <BtnLink onClick={onClearFilters} style={{ color: "green" }}>
                    clear
                </BtnLink>
            </section>
        </div>
    );
}
