import { C_PROPERTIES } from "../constants/properties";
import { BaseSellerAccountType, SellerAccountType } from "./seller";

export type PropertyTypeType =
    (typeof C_PROPERTIES.CATEGORY.OPTIONS)[keyof typeof C_PROPERTIES.CATEGORY.OPTIONS]["value"];

export type PropertyTypeDisplayType =
    (typeof C_PROPERTIES.CATEGORY.OPTIONS)[keyof typeof C_PROPERTIES.CATEGORY.OPTIONS]["text"];

export type PropertyStatusType = (typeof C_PROPERTIES.STATUS)[keyof typeof C_PROPERTIES.STATUS]["value"];

export type PropertyStatusDisplayType = (typeof C_PROPERTIES.STATUS)[keyof typeof C_PROPERTIES.STATUS]["text"];

export type PropertySortOptionType =
    (typeof C_PROPERTIES.SORT.OPTIONS)[keyof typeof C_PROPERTIES.SORT.OPTIONS]["value"];

export type PropertySortOptionDisplayType =
    (typeof C_PROPERTIES.SORT.OPTIONS)[keyof typeof C_PROPERTIES.SORT.OPTIONS]["text"];

export type BasePropertyType = {
    id: number;
    seller_account: BaseSellerAccountType;
    property_type: PropertyTypeType;
    property_type_display: PropertyTypeDisplayType;
    province: string;
    city: string;
    barangay: string;
    street: string;
    address: string;
    lot_area?: number;
    floor_area?: number;
    num_of_floors?: number;
    bedrooms?: number;
    bathrooms?: number;
    date_created: Date;
    status: PropertyStatusType;
    status_display: PropertyStatusDisplayType;
    image1_path?: string;
    image2_path?: string;
    image3_path?: string;
    image4_path?: string;
    image5_path?: string;
};

export type PropertyType = BasePropertyType & {
    seller_account: SellerAccountType;
};

export type PaginatedPropertiesType = {
    count: number;
    links: {
        next: string | null;
        previous: string | null;
    };
    pages: number;
    results: PropertyType[];
};
