import { BasePropertyType } from "./property";
import { BaseAgentAccountType } from "./agent";

export type AssignedPropertyType = {
    property: BasePropertyType;
    date_added: Date;
};

export type AssignedAgentType = {
    agent: BaseAgentAccountType;
    date_added: Date;
};

export type PropertyAgentAssignmentType = AssignedAgentType & AssignedPropertyType;
