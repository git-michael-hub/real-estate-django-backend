import { UserType } from "./auth";

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
