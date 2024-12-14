import BtnIconRound from "../../../../../components/Buttons/BtnIconRound";
import useAuth from "../../../../../features/auth/hooks/useAuth";
import useListing from "../../../../../features/listings/hooks/useListings";
import { FilterOptionType } from "../FilterModal";
import "./index.css";

export type SortOptionType = "NTO" | "OTN" | "ATZ";

type SortDropDownBtnProps = {
    setIsSortDropdownVisible: React.Dispatch<React.SetStateAction<boolean>>;
    isSortDropdownVisible: boolean;
    setSortBy: React.Dispatch<React.SetStateAction<SortOptionType>>;
    filterBy: FilterOptionType;
    sortBy: SortOptionType;
};

export default function SortDropDownBtn({
    setIsSortDropdownVisible,
    isSortDropdownVisible,
    setSortBy,
    sortBy,
    filterBy,
}: SortDropDownBtnProps) {
    const { fetchListingsAndUpdateState } = useListing();
    const { user } = useAuth();

    async function onClickSortOption(sortOption: SortOptionType) {
        let params = `?username=${user?.username}&sort_by=${sortOption}&listing_type=${filterBy.listing_type}&property_type=${filterBy.property_type}`;
        if (filterBy.is_available) params = params + `&is_available=${filterBy.is_available}`;
        await fetchListingsAndUpdateState(params);
        setSortBy(sortOption);
        setIsSortDropdownVisible(false);
    }

    function toggleSortDropdownVisibility() {
        setIsSortDropdownVisible(!isSortDropdownVisible);
    }

    return (
        <span id="sort-dropdown-btn">
            <BtnIconRound onClick={toggleSortDropdownVisibility}>
                <i className="fa-solid fa-arrow-up-wide-short"></i>
            </BtnIconRound>
            {isSortDropdownVisible ? (
                <ul className="dropdown">
                    <li onClick={() => onClickSortOption("NTO")}>
                        <span>Newest to Oldest</span> {sortBy === "NTO" ? <i className="fa-solid fa-check"></i> : <></>}
                    </li>
                    <li onClick={() => onClickSortOption("OTN")}>
                        <span>Oldest to Newest</span> {sortBy === "OTN" ? <i className="fa-solid fa-check"></i> : <></>}
                    </li>
                    <li onClick={() => onClickSortOption("ATZ")}>
                        <span>A to Z</span> {sortBy === "ATZ" ? <i className="fa-solid fa-check"></i> : <></>}
                    </li>
                </ul>
            ) : (
                <></>
            )}
        </span>
    );
}
