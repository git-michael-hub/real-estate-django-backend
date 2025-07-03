export type AccountType = "BuyerAccount" | "SellerAccount" | "AgentAccount";

export type Role = "buyer" | "seller" | "agent";

export type AuthUserType = {
    id: number;
    username: string;
    email: string;
    roles: Role[];
};

export type UserType = {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    date_joined: string;
};
