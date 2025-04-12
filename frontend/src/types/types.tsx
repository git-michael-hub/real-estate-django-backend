export type AccountType = "BuyerAccount" | "SellerAccount" | "AgentAccount";

export type Role = "buyer" | "seller" | "agent";

export type AuthUserType = {
    id: number;
    username: string;
    email: string;
    roles: Role[];
};

export type AuthFormMessageType = {
    success?: string[];
    error?: string[];
    username?: string[];
    email?: string[];
    first_name?: string[];
    last_name?: string[];
    password?: string[];
    non_field_errors?: string[];
    new_password?: string[];
    confirm_password?: string[];
    email_verification_pin?: string[];
};

export type UserType = {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    date_joined: string;
};

export type BaseBuyerAccountType = {
    user: UserType;
};

export type BuyerAccountType = BaseBuyerAccountType & {
    bio: string;
    profile_image_path?: string;
};

export type BaseSellerAccountType = {
    user: UserType;
    business_name: string;
    business_address: string;
    profile_image_path?: string;
    description: string;
};

export type SellerAccountType = BaseSellerAccountType & {
    contact_number_1?: string;
    contact_number_2?: string;
    is_active: boolean;
    date_approved: Date;
};

export type SellerApplicationStatusType = "A" | "P" | "R" | "C";

export type BaseSellerApplicationType = {
    id: number;
    business_name: string;
    status: SellerApplicationStatusType;
    application_date: string;
};

export type SellerApplicationType = BaseSellerApplicationType & {
    seller_account: number;
    business_address: string;
    date_reviewed?: Date;
    is_active: boolean;
};

export type BaseAgentAccountType = {
    pk: number;
    agent_name: string;
    bio: string;
    profile_image_path: string;
};

export type AgentAccountType = BaseAgentAccountType & {
    user: number;
    is_active: boolean;
    date_approved?: Date;
};

export type AgentApplicationStatusType = SellerApplicationStatusType;

export type BaseAgentApplicationType = {
    id: number;
    agent_name: string;
    status: AgentApplicationStatusType;
    application_date: Date;
};

export type AgentApplicationType = BaseAgentApplicationType & {
    agent_account: number;
    license_number: string;
    license_document_path?: string;
    date_reviewed?: Date;
    is_active: boolean;
};

export type PropertyTypeType = "HL" | "CL" | "RL" | "CO";

export type PropertyStatusType = "R" | "L" | "H" | "S";

export type BasePropertyType = {
    seller_account: BaseSellerAccountType;
    property_type_display: string;
    province: string;
    city: string;
    barangay: string;
    street: string;
    lot_area?: number;
    floor_area?: number;
    num_of_floors?: number;
    bedrooms?: number;
    bathrooms?: number;
    date_created: Date;
    image1_path?: string;
    image2_path?: string;
    image3_path?: string;
    image4_path?: string;
    image5_path?: string;
};

export type PropertyType = BasePropertyType & {
    seller_account: SellerAccountType;
};

export type AssignedPropertyType = {
    property: BasePropertyType;
    date_added: Date;
};

export type AssignedAgentType = {
    agent: BaseAgentAccountType;
    date_added: Date;
};

export type PropertyAgentAssignmentType = AssignedAgentType & AssignedPropertyType;

export type ListingTypeType = "FS" | "FR" | "FC";

export type ListingStatusType = "A" | "H" | "S" | "C" | "R";

export type BaseListingType = {
    listing_type: ListingTypeType;
    listing_type_display: string;
    property: BasePropertyType;
    agent_account?: BaseAgentAccountType;
    title: string;
    price: number;
    description: string;
    created_at: Date;
    status: ListingStatusType;
};

export type ListingType = BaseListingType;

export type CreatedByType = {
    type: AccountType;
    pk: number;
    name: string;
};

export type BaseOfferType = {
    pk: number;
    listing: BaseListingType;
    created_by: CreatedByType;
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

export type TransactionStatusType = "P" | "IP" | "CO" | "CA";

export type BaseTransactionType = {
    offer: number;
    status: TransactionStatusType;
    date_created: Date;
};

export type TransactionType = BaseTransactionType & {
    offer: OfferType;
};
