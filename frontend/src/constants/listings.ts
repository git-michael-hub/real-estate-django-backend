export const C_LISTINGS = {
    TYPES: {
        FOR_SALE: { text: "For Sale", value: "FS" },
        FOR_RENT: { text: "For Rent", value: "FR" },
        FORECLOSURE: { text: "Foreclosure", value: "FC" },
    },
    STATUS: {
        ACTIVE: { text: "Active", value: "A" },
        ON_HOLD: { text: "On Hold", value: "H" },
        SOLD: { text: "Sold", value: "S" },
        CANCELLED: { text: "Cancelled", value: "C" },
        REMOVED: { text: "Removed", value: "R" },
    },
    SORT_OPTIONS: {
        NEW_TO_OLD: { text: "Newest to Oldest", value: "NTO" },
        OLD_TO_NEW: { text: "Oldest to Newest", value: "OTN" },
        A_TO_Z: { text: "A to Z", value: "ATZ" },
        Z_TO_A: { text: "Z to A", value: "ZTA" },
    },
} as const;
