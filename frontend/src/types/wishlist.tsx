import { BaseListingType } from "./listing";

export type WishlistEntryType = {
    pk: number;
    listing: BaseListingType;
    date_added: Date;
};

export type WishlistType = WishlistEntryType[];
