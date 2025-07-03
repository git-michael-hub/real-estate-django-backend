const BEDROOMS = "bedrooms";
const BATHROOMS = "bathrooms";
const LOT_AREA = "lot_area";
const FLOOR_AREA = "floor_area";
const NUM_OF_FLOORS = "num_of_floors";

const READY_FOR_LISTING = { text: "Ready for Listing", value: "R" } as const;
const LISTED = { text: "Listed", value: "L" } as const;
const ON_HOLD = { text: "On Hold", value: "H" } as const;
const SOLD = { text: "Sold", value: "S" } as const;

const STATUS = {
    READY_FOR_LISTING,
    LISTED,
    ON_HOLD,
    SOLD,
} as const;

const ALLOWED_TO_EDIT_STATUS = [
    STATUS.READY_FOR_LISTING.value,
    STATUS.LISTED.value,
] as (typeof STATUS)[keyof typeof STATUS]["value"][];

const HOUSE_AND_LOT = {
    text: "House and Lot",
    value: "HL",
    visible_details: [BEDROOMS, BATHROOMS, LOT_AREA, FLOOR_AREA, NUM_OF_FLOORS],
} as const;

const RESIDENTIAL_LOT = {
    text: "Residential Lot",
    value: "RL",
    visible_details: [LOT_AREA],
} as const;

const COMMERCIAL_LOT = {
    text: "Commercial Lot",
    value: "CL",
    visible_details: [LOT_AREA],
} as const;

const CONDOMINIUM = {
    text: "Condominium",
    value: "CO",
    visible_details: [BEDROOMS, BATHROOMS, FLOOR_AREA, NUM_OF_FLOORS],
} as const;

const CATEGORY_OPTIONS = {
    HOUSE_AND_LOT,
    RESIDENTIAL_LOT,
    COMMERCIAL_LOT,
    CONDOMINIUM,
} as const;

const CATEGORY = {
    OPTIONS: CATEGORY_OPTIONS,
    OPTIONS_LIST: Object.values(CATEGORY_OPTIONS).map((categoryOption) => categoryOption),
    TEXT_LIST: Object.values(CATEGORY_OPTIONS).map((categoryOption) => categoryOption.text),
    VALUE_LIST: Object.values(CATEGORY_OPTIONS).map((categoryOption) => categoryOption.value),
    SELECT_HTML: {
        bedrooms: { placeholder: "No. of bedrooms", type: "number", name: BEDROOMS, i: "fa-solid fa-bed" },
        bathrooms: {
            placeholder: "No. of bathrooms",
            type: "number",
            name: BATHROOMS,
            i: "fa-solid fa-shower",
        },
        lot_area: { placeholder: "Lot Area (sqm)", type: "number", name: LOT_AREA, i: "fa-solid fa-expand" },
        floor_area: {
            placeholder: "Floor Area (sqm)",
            type: "number",
            name: FLOOR_AREA,
            i: "fa-solid fa-chart-area",
        },
        num_of_floors: {
            placeholder: "No. of Floors",
            type: "number",
            name: NUM_OF_FLOORS,
            i: "fa-solid fa-layer-group",
        },
    },
} as const;

const STREET = "street";
const BARANGAY = "barangay";
const CITY = "city";
const PROVINCE = "province";

const ADDRESS = {
    COMPONENTS: [STREET, BARANGAY, CITY, PROVINCE],
    HTML_CONFIG: [
        { placeholder: STREET.charAt(0).toUpperCase() + STREET.slice(1), type: "text", name: STREET },
        { placeholder: BARANGAY.charAt(0).toUpperCase() + BARANGAY.slice(1), type: "text", name: BARANGAY },
        { placeholder: CITY.charAt(0).toUpperCase() + CITY.slice(1), type: "text", name: CITY },
        { placeholder: PROVINCE.charAt(0).toUpperCase() + PROVINCE.slice(1), type: "text", name: PROVINCE },
    ],
} as const;

const NEW_TO_OLD = { text: "Newest to Oldest", value: "NTO" } as const;
const OLD_TO_NEW = { text: "Oldest to Newest", value: "OTN" } as const;
const A_TO_Z = { text: "A to Z", value: "ATZ" } as const;
const Z_TO_A = { text: "Z to A", value: "ZTA" } as const;
const SORT_OPTIONS = {
    NEW_TO_OLD,
    OLD_TO_NEW,
    A_TO_Z,
    Z_TO_A,
} as const;

const SORT = {
    OPTIONS: SORT_OPTIONS,
    OPTIONS_LIST: Object.entries(SORT_OPTIONS).map(([, sortOption]) => sortOption),
    TEXT_LIST: Object.entries(SORT_OPTIONS).map(([, sortOption]) => sortOption.text),
    VALUE_LIST: Object.entries(SORT_OPTIONS).map(([, sortOption]) => sortOption.value),
} as const;

export const C_PROPERTIES = { CATEGORY, STATUS, ALLOWED_TO_EDIT_STATUS, SORT, ADDRESS } as const;
