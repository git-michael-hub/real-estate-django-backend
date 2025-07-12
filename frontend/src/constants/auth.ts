const BUYER = "buyer";
const SELLER = "seller";
const AGENT = "agent";

const ACCOUNT_ROLE = {
    BUYER: BUYER,
    SELLER: SELLER,
    AGENT: AGENT,
} as const;

const PROFILE_IMAGE = "/static/images/default-profile-picture.jpg";

const DEFAULT = { PROFILE_IMAGE: PROFILE_IMAGE };

export const C_AUTH = { ACCOUNT_ROLE, DEFAULT };
