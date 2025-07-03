import { useRef } from "react";
import useProperty from "../../../../features/properties/hooks/useProperties";
import BtnLink from "../../../../components/Buttons/BtnLink";
import { PropertyStatusType, PropertyTypeType } from "../../../../types/property";
import "./index.css";

const PROPERTY_STATUS_HTML_CONFIG = {
    READY_FOR_LISTING: {
        pk: 1,
        type: "radio",
        name: "status",
        id: "R",
        value: "R",
        index: 0,
        label: "Ready for Listing",
    },
    LISTED: { pk: 2, type: "radio", name: "status", id: "L", value: "L", index: 1, label: "Listed" },
    ON_HOLD: { pk: 3, type: "radio", name: "status", id: "H", value: "H", index: 2, label: "On Hold" },
    SOLD: { pk: 4, type: "radio", name: "status", id: "S", value: "S", index: 3, label: "Sold" },
} as const;

const PROPERTY_TYPE_HTML_CONFIG = {
    HOUSE_AND_LOT: {
        pk: 1,
        type: "radio",
        name: "property_type",
        id: "HL",
        value: "HL",
        index: 0,
        label: "House and Lot",
    },
    COMMERCIAL_LOT: {
        pk: 2,
        type: "radio",
        name: "property_type",
        id: "CL",
        value: "CL",
        index: 1,
        label: "Commercial Lot",
    },
    RESIDENTIAL_LOT: {
        pk: 3,
        type: "radio",
        name: "property_type",
        id: "RL",
        value: "RL",
        index: 2,
        label: "Residential Lot",
    },
    CONDOMINUIM: { pk: 4, type: "radio", name: "property_type", id: "CO", value: "CO", index: 3, label: "Condominium" },
} as const;

type FilterModalProps = {
    setIsFilterModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    params: URLSearchParams;
    setParams: React.Dispatch<React.SetStateAction<URLSearchParams>>;
};

export default function FilterModal({ setIsFilterModalVisible, params, setParams }: FilterModalProps) {
    const propertyStatusRefs = useRef<(HTMLInputElement | null)[]>([]);
    const propertyTypeRefs = useRef<(HTMLInputElement | null)[]>([]);
    const { fetchPropertiesAndUpdateState } = useProperty();

    function closeModal() {
        setIsFilterModalVisible(false);
    }

    async function onClickPropertyStatus(status: PropertyStatusType) {
        const newParams = new URLSearchParams(params.toString());
        newParams.set("status", status);
        await fetchPropertiesAndUpdateState(`?${newParams.toString()}`);
        setParams(newParams);
    }

    async function onClickPropertyType(propertyType: PropertyTypeType) {
        const newParams = new URLSearchParams(params.toString());
        newParams.set("property_type", propertyType);
        await fetchPropertiesAndUpdateState(`?${newParams.toString()}`);
        setParams(newParams);
    }

    async function onClearFilters() {
        propertyStatusRefs.current.forEach((el) => {
            if (el) el.checked = false;
        });
        propertyTypeRefs.current.forEach((el) => {
            if (el) el.checked = false;
        });

        const newParams = new URLSearchParams(params.toString());
        newParams.delete("status");
        newParams.delete("property_type");
        await fetchPropertiesAndUpdateState(`?${newParams}`);
        setParams(newParams);
    }

    return (
        <div id="filter-modal-background-mask">
            <section id="filter-modal">
                <BtnLink onClick={closeModal}>close</BtnLink>
                <div>
                    <b>Status</b>
                    {Object.entries(PROPERTY_STATUS_HTML_CONFIG).map(([, config]) => {
                        return (
                            <div key={config.pk}>
                                <input
                                    type={config.type}
                                    name={config.name}
                                    id={config.id}
                                    onClick={() => onClickPropertyStatus(config.value as PropertyStatusType)}
                                    ref={(el) => (propertyStatusRefs.current[config.index] = el)}
                                    defaultChecked={params.get(config.name) === config.value ? true : false}
                                />
                                <label htmlFor={config.id}>{config.label}</label>
                            </div>
                        );
                    })}
                </div>

                <div>
                    <b>Property Type</b>
                    {Object.entries(PROPERTY_TYPE_HTML_CONFIG).map(([, config]) => {
                        return (
                            <div key={config.pk}>
                                <input
                                    type="radio"
                                    name={config.name}
                                    id={config.id}
                                    onClick={() => onClickPropertyType(config.value as PropertyTypeType)}
                                    ref={(el) => (propertyTypeRefs.current[config.index] = el)}
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
