const BUYER = "buyer";
const SELLER = "seller";
const AGENT = "agent";

const ACCOUNT_ROLE = {
    BUYER: BUYER,
    SELLER: SELLER,
    AGENT: AGENT,
} as const;

export const C_AUTH = { ACCOUNT_ROLE };
