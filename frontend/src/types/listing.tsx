import { C_LISTINGS } from "../constants/listings";
import { BasePropertyType } from "./property";
import { BaseAgentAccountType } from "./agent";

export type ListingTypeType = (typeof C_LISTINGS.TYPES)[keyof typeof C_LISTINGS.TYPES]["value"];

export type ListingTypeDisplayType = (typeof C_LISTINGS.TYPES)[keyof typeof C_LISTINGS.TYPES]["text"];

export type ListingStatusType = (typeof C_LISTINGS.STATUS)[keyof typeof C_LISTINGS.STATUS]["value"];

export type ListingStatusDisplayType = (typeof C_LISTINGS.STATUS)[keyof typeof C_LISTINGS.STATUS]["text"];

export type ListingSortOptionType = (typeof C_LISTINGS.SORT_OPTIONS)[keyof typeof C_LISTINGS.SORT_OPTIONS]["value"];

export type ListingSortOptionDisplayType =
    (typeof C_LISTINGS.SORT_OPTIONS)[keyof typeof C_LISTINGS.SORT_OPTIONS]["text"];

export type BaseListingType = {
    id: number;
    listing_type: ListingTypeType;
    listing_type_display: string;
    property: BasePropertyType;
    agent_account?: BaseAgentAccountType;
    title: string;
    price: number;
    description: string;
    created_at: Date;
    status: ListingStatusType;
    status_display: ListingStatusDisplayType;
};

export type ListingType = BaseListingType;

export type PaginatedListingsType = {
    count: number;
    links: {
        next: string | null;
        previous: string | null;
    };
    pages: number;
    results: BaseListingType[];
};
