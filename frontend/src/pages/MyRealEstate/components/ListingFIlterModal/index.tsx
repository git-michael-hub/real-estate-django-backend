import { useRef } from "react";
import { PropertyStatusType } from "../../../../types/property";
import { ListingTypeType } from "../../../../types/listing";
import useListing from "../../../../features/listings/hooks/useListings";
import BtnLink from "../../../../components/Buttons/BtnLink";
import "./index.css";

const LISTING_STATUS_HTML_CONFIG = {
    ACTIVE: { pk: 1, type: "radio", name: "status", id: "A", value: "A", index: 0, label: "Active" },
    HOLD: { pk: 2, type: "radio", name: "status", id: "H", value: "H", index: 1, label: "On Hold" },
    CANCELLED: { pk: 3, type: "radio", name: "status", id: "C", value: "C", index: 2, label: "Cancelled" },
    SOLD: { pk: 4, type: "radio", name: "status", id: "S", value: "S", index: 3, label: "Sold" },
    REMOVED: { pk: 5, type: "radio", name: "status", id: "R", value: "R", index: 4, label: "Removed" },
} as const;

const LISTING_TYPE_HTML_CONFIG = {
    FOR_SALE: {
        pk: 1,
        type: "radio",
        name: "listing_type",
        id: "FS",
        value: "FS",
        index: 0,
        label: "For Sale",
    },
    FOR_RENT: {
        pk: 2,
        type: "radio",
        name: "listing_type",
        id: "FR",
        value: "FR",
        index: 1,
        label: "For Rent",
    },
    FORECLOSURE: {
        pk: 3,
        type: "radio",
        name: "listing_type",
        id: "FC",
        value: "FC",
        index: 2,
        label: "Foreclosure",
    },
} as const;

type FilterModalProps = {
    setIsFilterModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    params: URLSearchParams;
    setParams: React.Dispatch<React.SetStateAction<URLSearchParams>>;
};

export default function ListingFilterModal({ setIsFilterModalVisible, params, setParams }: FilterModalProps) {
    const listingStatusRefs = useRef<(HTMLInputElement | null)[]>([]);
    const listingTypeRefs = useRef<(HTMLInputElement | null)[]>([]);
    const { getListingsForSeller } = useListing();

    function closeModal() {
        setIsFilterModalVisible(false);
    }

    async function onClickListingStatus(status: PropertyStatusType) {
        const newParams = new URLSearchParams(params.toString());
        newParams.set("status", status);
        await getListingsForSeller(`?${newParams.toString()}`);
        setParams(newParams);
    }

    async function onClickListingType(listingType: ListingTypeType) {
        const newParams = new URLSearchParams(params.toString());
        newParams.set("listing_type", listingType);
        await getListingsForSeller(`?${newParams.toString()}`);
        setParams(newParams);
    }

    async function onClearFilters() {
        listingStatusRefs.current.forEach((el) => {
            if (el) el.checked = false;
        });
        listingTypeRefs.current.forEach((el) => {
            if (el) el.checked = false;
        });

        const newParams = new URLSearchParams(params.toString());
        newParams.delete("status");
        newParams.delete("listing_type");
        await getListingsForSeller(`?${newParams}`);
        setParams(newParams);
    }

    return (
        <div id="listing-filter-modal-background-mask">
            <section id="filter-modal">
                <BtnLink onClick={closeModal}>close</BtnLink>
                <div>
                    <b>Status</b>
                    {Object.entries(LISTING_STATUS_HTML_CONFIG).map(([, config]) => {
                        return (
                            <div key={config.pk}>
                                <input
                                    type={config.type}
                                    name={config.name}
                                    id={config.id}
                                    onClick={() => onClickListingStatus(config.value as PropertyStatusType)}
                                    ref={(el) => (listingStatusRefs.current[config.index] = el)}
                                    defaultChecked={params.get(config.name) === config.value ? true : false}
                                />
                                <label htmlFor={config.id}>{config.label}</label>
                            </div>
                        );
                    })}
                </div>

                <div>
                    <b>Listing Type</b>
                    {Object.entries(LISTING_TYPE_HTML_CONFIG).map(([, config]) => {
                        return (
                            <div key={config.pk}>
                                <input
                                    type="radio"
                                    name={config.name}
                                    id={config.id}
                                    onClick={() => onClickListingType(config.value as ListingTypeType)}
                                    ref={(el) => (listingTypeRefs.current[config.index] = el)}
                                    defaultChecked={params.get(config.name) === config.value ? true : false}
                                />
                                <label htmlFor={config.id}>{config.label}</label>
                            </div>
                        );
                    })}
                </div>

                <BtnLink onClick={onClearFilters} style={{ color: "green" }}>
                    clear
                </BtnLink>
            </section>
        </div>
    );
}
