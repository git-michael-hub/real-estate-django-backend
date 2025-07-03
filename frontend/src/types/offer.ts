import { AccountType } from "./auth";
import { BaseListingType } from "./listing";
import { BaseBuyerAccountType } from "./buyer";
import { BaseAgentAccountType } from "./agent";
import { BaseSellerAccountType } from "./seller";

export type OfferCreatedByType = {
    type: AccountType;
    pk: number;
    name: string;
};

export type BaseOfferType = {
    pk: number;
    listing: BaseListingType;
    created_by: OfferCreatedByType;
    price: number;
    date_created: Date;
};

export type PaymentMethodType = "BT" | "BL" | "I" | "CP" | "CHP";

export type OfferResponseType = "P" | "A" | "R" | "C";

export type OfferStatusType = "W" | "A" | "R" | "C";

export type OfferType = BaseOfferType & {
    buyer_account: BaseBuyerAccountType;
    seller_account: BaseSellerAccountType;
    agent_account: BaseAgentAccountType;
    payment_method: PaymentMethodType;
    status: OfferStatusType;
    buyer_offer_response: OfferResponseType;
    seller_offer_response: OfferResponseType;
    agent_offer_response: OfferResponseType;
};
