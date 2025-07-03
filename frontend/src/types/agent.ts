import { UserType } from "./auth";
import { SellerApplicationStatusType } from "./seller";

export type BaseAgentAccountType = {
    pk: number;
    user: UserType;
    agent_name: string;
    bio: string;
    profile_image_path: string;
};

export type AgentAccountType = BaseAgentAccountType & {
    is_active: boolean;
    contact_number_1?: string;
    contact_number_2?: string;
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
