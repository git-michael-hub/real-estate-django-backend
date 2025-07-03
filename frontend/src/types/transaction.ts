import { OfferType } from "./offer";

export type TransactionStatusType = "P" | "IP" | "CO" | "CA";

export type BaseTransactionType = {
    offer: number;
    status: TransactionStatusType;
    date_created: Date;
};

export type TransactionType = BaseTransactionType & {
    offer: OfferType;
};
