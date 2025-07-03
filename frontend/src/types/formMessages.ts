export type FormMessageType = {
    success?: string[];
    error?: string[];
    non_field_errors?: string[];
};

export type AuthFormMessageType = FormMessageType & {
    username?: string[];
    email?: string[];
    first_name?: string[];
    last_name?: string[];
    password?: string[];
    new_password?: string[];
    confirm_password?: string[];
    email_verification_pin?: string[];
};

export type BuyerFormMessageType = FormMessageType & {
    bio?: string[];
    profile_image_path?: string[];
};

export type ListingFormMessageStateType = {
    success?: string[];
    error?: string[];
    title?: string[];
    listing_type?: string[];
    property_type?: string[];
    price?: string[];
    image1_path?: string[];
    image2_path?: string[];
    image3_path?: string[];
    image4_path?: string[];
    image5_path?: string[];
    lot_area?: string[];
    floor_area?: string[];
    num_of_floors?: string[];
    description?: string[];
    bedrooms?: string[];
    bathrooms?: string[];
    province?: string[];
    city?: string[];
    baranggay?: string[];
    street?: string[];
    detail?: string;
};
