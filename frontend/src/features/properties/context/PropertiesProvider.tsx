import { createContext, useState } from "react";
import { apiFns, APIResponseType } from "../../../utils/api-service";
import { AgentAccountType } from "../../../types/agent";
import { PaginatedPropertiesType, PropertyType } from "../../../types/property";
import { API_URLS } from "../../../urls/api-urls";
import { authFns } from "../../../utils/auth-utils";

export type PropertyAgentAssignmentType = {
    property: PropertyType;
    agent: AgentAccountType;
    date_added: string;
};

export const API_DIRECTORY_PROPERTIES = "api/properties/";

type ChildrenType = { children?: React.ReactElement | React.ReactElement[] };

export const PropertyProvider = ({ children }: ChildrenType): React.ReactElement => {
    const [property, setProperty] = useState<PropertyType | null>(null);
    const [properties, setProperties] = useState<PropertyType[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pages, setPages] = useState<number>(1);
    const [nextPageLink, setNextPageLink] = useState<string | null>(null);
    const [previousPageLink, setPreviousPageLink] = useState<string | null>(null);
    const [propertyAgentAssignments, setPropertyAgentAssignments] = useState<PropertyAgentAssignmentType[] | []>([]);

    const fetchProperty = async (propertyId: string | number): Promise<PropertyType | null> => {
        const response: APIResponseType = await apiFns.get(
            API_URLS.PROPERTY.RETRIEVE(propertyId),
            authFns.createAuthorizationHeader()
        );
        if (response.success) return response.data;
        console.log(response.err_messages);
        return null;
    };

    const fetchProperties = async (searchParams?: string): Promise<PaginatedPropertiesType | null> => {
        const response: APIResponseType = await apiFns.get(
            API_URLS.PROPERTY.LIST(searchParams),
            authFns.createAuthorizationHeader()
        );
        if (response.success) return response.data;
        console.log(response.err_messages);
        return null;
    };

    const fetchPropertyAndUpdateState = async (propertyId: string | number): Promise<PropertyType | null> => {
        const property: PropertyType | null = await fetchProperty(propertyId);
        setProperty(property);
        return property;
    };

    const fetchPropertiesAndUpdateState = async (searchParams: string): Promise<void> => {
        const paginated_properties = await fetchProperties(searchParams);
        if (paginated_properties) {
            const urlSearchParams = new URLSearchParams(searchParams);
            const page = urlSearchParams.get("page");
            if (page) setPage(Number(page));
            if (page === null) setPage(1);
            setPages(paginated_properties.pages);
            setProperties(paginated_properties.results);
            setNextPageLink(paginated_properties.links.next);
            setPreviousPageLink(paginated_properties.links.previous);
        }
    };

    const createProperty = async (formData: FormData): Promise<APIResponseType> => {
        const response: APIResponseType = await apiFns.post(
            API_URLS.PROPERTY.CREATE(),
            formData,
            authFns.createAuthorizationHeader()
        );
        if (!response.success) console.log(response.err_messages);
        return response;
    };

    const deleteProperty = async (propertyId: number | string): Promise<boolean> => {
        const response: APIResponseType = await apiFns.del(
            API_URLS.PROPERTY.DELETE(propertyId),
            authFns.createAuthorizationHeader()
        );
        return response.success;
    };

    const editProperty = async (formData: FormData, propertyId: number | string): Promise<APIResponseType | null> => {
        try {
            const response: APIResponseType = await apiFns.patch(
                API_URLS.PROPERTY.EDIT(propertyId),
                formData,
                authFns.createAuthorizationHeader()
            );
            return response;
        } catch (error) {
            alert("An error occurred");
            return null;
        }
    };

    const fetchPropertyAssignedAgents = async (
        propertyId: number | string
    ): Promise<PropertyAgentAssignmentType[] | []> => {
        const response: APIResponseType = await apiFns.get(
            API_URLS.PROPERTY.ASSIGNED_AGENTS(propertyId),
            authFns.createAuthorizationHeader()
        );
        if (response.success) return response.data as PropertyAgentAssignmentType[] | [];
        return [];
    };

    const fetchPropertyAssignedAgentsAndUpdateState = async (
        propertyId: number | string
    ): Promise<PropertyAgentAssignmentType[] | []> => {
        const propertyAgentAssignments: PropertyAgentAssignmentType[] | [] = await fetchPropertyAssignedAgents(
            propertyId
        );
        setPropertyAgentAssignments(propertyAgentAssignments);
        return propertyAgentAssignments;
    };

    return (
        <PropertyContext.Provider
            value={{
                property,
                setProperty,
                properties,
                setProperties,
                fetchProperty,
                fetchProperties,
                createProperty,
                deleteProperty,
                editProperty,
                page,
                pages,
                nextPageLink,
                previousPageLink,
                setPage,
                setPages,
                setNextPageLink,
                setPreviousPageLink,
                fetchPropertyAndUpdateState,
                fetchPropertiesAndUpdateState,
                fetchPropertyAssignedAgents,
                setPropertyAgentAssignments,
                propertyAgentAssignments,
                fetchPropertyAssignedAgentsAndUpdateState,
            }}
        >
            {children}
        </PropertyContext.Provider>
    );
};

export type PropertyContextType = {
    property: PropertyType | null;
    setProperty: React.Dispatch<React.SetStateAction<PropertyType | null>>;
    properties: PropertyType[];
    setProperties: React.Dispatch<React.SetStateAction<PropertyType[]>>;
    fetchProperty: (propertyId: number | string) => Promise<PropertyType | null>;
    fetchProperties: (searchParams: string) => Promise<PaginatedPropertiesType | null>;
    createProperty: (formData: FormData) => Promise<APIResponseType>;
    deleteProperty: (propertyId: number | string) => Promise<boolean>;
    editProperty: (formData: FormData, propertyId: number) => Promise<APIResponseType | null>;
    page: number;
    pages: number;
    nextPageLink: string | null;
    previousPageLink: string | null;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setPages: React.Dispatch<React.SetStateAction<number>>;
    setNextPageLink: React.Dispatch<React.SetStateAction<string | null>>;
    setPreviousPageLink: React.Dispatch<React.SetStateAction<string | null>>;
    fetchPropertyAndUpdateState: (propertyId: number | string) => Promise<PropertyType | null>;
    fetchPropertiesAndUpdateState: (searchParams: string) => Promise<void>;
    fetchPropertyAssignedAgents: (propertyId: number | string) => Promise<PropertyAgentAssignmentType[] | []>;
    fetchPropertyAssignedAgentsAndUpdateState: (
        propertyId: number | string
    ) => Promise<PropertyAgentAssignmentType[] | []>;

    propertyAgentAssignments: [] | PropertyAgentAssignmentType[];
    setPropertyAgentAssignments: React.Dispatch<React.SetStateAction<[] | PropertyAgentAssignmentType[]>>;
};

const initPropertyContextState: PropertyContextType = {
    property: null,
    setProperty: () => {},
    properties: [],
    setProperties: () => {},
    fetchProperty: () => Promise.resolve(null),
    fetchProperties: () => Promise.resolve(null),
    createProperty: () => Promise.resolve({ success: false }),
    deleteProperty: () => Promise.resolve(false),
    editProperty: () => Promise.resolve(null),
    page: 1,
    pages: 1,
    nextPageLink: null,
    previousPageLink: null,
    setPage: () => {},
    setPages: () => {},
    setNextPageLink: () => {},
    setPreviousPageLink: () => {},
    fetchPropertyAndUpdateState: () => Promise.resolve(null),
    fetchPropertiesAndUpdateState: () => Promise.resolve(),
    fetchPropertyAssignedAgents: () => Promise.resolve([]),
    fetchPropertyAssignedAgentsAndUpdateState: () => Promise.resolve([]),
    propertyAgentAssignments: [],
    setPropertyAgentAssignments: () => {},
};

const PropertyContext = createContext<PropertyContextType>(initPropertyContextState);

export default PropertyContext;
