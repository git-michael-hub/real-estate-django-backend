import { C_AUTH } from "../constants/auth";

export type AccountType = "BuyerAccount" | "SellerAccount" | "AgentAccount";

export type AuthRole = (typeof C_AUTH.ACCOUNT_ROLE)[keyof typeof C_AUTH.ACCOUNT_ROLE];

export type AuthUserType = {
    id: number;
    username: string;
    email: string;
    roles: AuthRole[];
};

export type UserType = {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    date_joined: string;
};
