export type SellerType = {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    contact_number_1: number;
    contact_number_2?: number;
    seller_image_url: string;
};

export type SellerDetailsType = SellerType & {
    bio?: string;
    address: string;
    birthdate: Date;
    date_joined: Date;
    gender: "M" | "F";
};
