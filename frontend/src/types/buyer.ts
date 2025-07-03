import { UserType } from "./auth";

export type BaseBuyerAccountType = {
    user: UserType;
};

export type BuyerAccountType = BaseBuyerAccountType & {
    bio: string;
    profile_image_path?: string;
};
