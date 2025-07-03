import { Link, useNavigate, useParams } from "react-router-dom";
import MyRealEstateHeader from "../components/MyRealEstateHeader";
import useProperty from "../../../features/properties/hooks/useProperties";
import { useEffect, useState } from "react";
import useListing from "../../../features/listings/hooks/useListings";
import helperFn from "../../../utils/form-utils";
import "./index.css";
import BtnBasicActive from "../../../components/Buttons/BtnBasicActive";
import BtnBasicDisabled from "../../../components/Buttons/BtnBasicDisabled";
import { C_PROPERTIES } from "../../../constants/properties";
import { PropertyTypeType } from "../../../types/property";

const PROPERTY_TYPE_DETAILS_VISIBILITY = {
    HL: { bedrooms: true, bathrooms: true, lot_area: true, floor_area: true, num_of_floors: true },
    CO: { bedrooms: true, bathrooms: true, lot_area: false, floor_area: true, num_of_floors: true },
    RL: { bedrooms: false, bathrooms: false, lot_area: true, floor_area: false, num_of_floors: false },
    CL: { bedrooms: false, bathrooms: false, lot_area: true, floor_area: false, num_of_floors: false },
} as const;

const PROPERTY_DETAILS_HTML_CONFIG = {
    bedrooms: { pk: 1, label: "No. of bedrooms", type: "number", name: "bedrooms", i: "fa-solid fa-bed" },
    bathrooms: { pk: 2, label: "No. of bathrooms", type: "number", name: "bathrooms", i: "fa-solid fa-shower" },
    lot_area: { pk: 3, label: "Lot Area (sqm)", type: "number", name: "lot_area", i: "fa-solid fa-expand" },
    floor_area: {
        pk: 4,
        label: "Floor Area (sqm)",
        type: "number",
        name: "floor_area",
        i: "fa-solid fa-chart-area",
    },
    num_of_floors: {
        pk: 5,
        label: "No. of Floors",
        type: "number",
        name: "num_of_floors",
        i: "fa-solid fa-layer-group",
    },
} as const;

export default function Property() {
    const [isReady, setIsReady] = useState<boolean>(false);
    const { propertyId } = useParams();
    const navigate = useNavigate();
    const {
        fetchPropertyAndUpdateState,
        property,
        fetchPropertyAssignedAgentsAndUpdateState,
        propertyAgentAssignments,
    } = useProperty();
    const { getListings, listings } = useListing();

    useEffect(() => {
        async function init() {
            if (propertyId) {
                const listingSearchParams = new URLSearchParams({ property: propertyId });
                await fetchPropertyAndUpdateState(propertyId);
                await getListings(`?${listingSearchParams.toString()}`);
                await fetchPropertyAssignedAgentsAndUpdateState(propertyId);
                setIsReady(true);
            }
        }

        init();
    }, []);

    function toEditProperty(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (property)
            navigate(`/my-real-estate/properties/${property.id}/edit`, { state: { propertyId: property.id } });
    }

    function toNewListings(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (property) {
            navigate("/my-real-estate/listings/new", { state: { propertyId: property.id } });
        }
    }

    return (
        <main id="my-property-page">
            {property && isReady ? (
                <>
                    <MyRealEstateHeader>
                        <h2>
                            My Properties{" "}
                            <span>
                                <i className="fa-solid fa-greater-than"> </i> {property.address}
                            </span>
                        </h2>
                        <div>
                            {property.status === "L" || property.status === "R" ? (
                                <BtnBasicActive onClick={toNewListings}>Create Listing</BtnBasicActive>
                            ) : (
                                <BtnBasicDisabled>Create Listing </BtnBasicDisabled>
                            )}
                        </div>
                    </MyRealEstateHeader>

                    <section>
                        <div>
                            <h3>Property Details</h3>
                            {property.status === C_PROPERTIES.STATUS.LISTED.value ||
                            property.status === C_PROPERTIES.STATUS.READY_FOR_LISTING.value ? (
                                <BtnBasicActive onClick={toEditProperty}>Edit Details</BtnBasicActive>
                            ) : (
                                <BtnBasicDisabled>Edit Details</BtnBasicDisabled>
                            )}
                        </div>
                        <section className="row-1">
                            <div className="column-1">
                                <div id="property-type">
                                    <h4>ID: </h4>
                                    <em>{property.id}</em>
                                </div>
                                <div id="property-type">
                                    <h4>Type: </h4>
                                    <em>{property.property_type_display}</em>
                                </div>
                                <div id="property-status">
                                    <h4>Status: </h4>
                                    <em>{property.status_display}</em>
                                </div>
                            </div>
                            <div className="column-2">
                                <h4>Address:</h4>
                                <ul>
                                    <li>
                                        <h5>Street: </h5>
                                        <em>{property.street}</em>
                                    </li>
                                    <li>
                                        <h5>Barangay: </h5>
                                        <em>{property.barangay}</em>
                                    </li>
                                    <li>
                                        <h5>City: </h5>
                                        <em>{property.city}</em>
                                    </li>
                                    <li>
                                        <h5>Province: </h5>
                                        <em>{property.province}</em>
                                    </li>
                                </ul>
                            </div>

                            <div className="column-3">
                                <h4>Other Details:</h4>
                                <ul>
                                    {(
                                        Object.entries(PROPERTY_DETAILS_HTML_CONFIG) as [
                                            keyof typeof PROPERTY_DETAILS_HTML_CONFIG,
                                            (typeof PROPERTY_DETAILS_HTML_CONFIG)[keyof typeof PROPERTY_DETAILS_HTML_CONFIG]
                                        ][]
                                    ).map(([key, config]) => {
                                        return (
                                            <>
                                                {PROPERTY_TYPE_DETAILS_VISIBILITY[
                                                    `${property.property_type as PropertyTypeType}`
                                                ][key] ? (
                                                    <li>
                                                        <h5>{config.label}: </h5>
                                                        <em>{property[key]}</em>
                                                    </li>
                                                ) : (
                                                    <></>
                                                )}
                                            </>
                                        );
                                    })}
                                </ul>
                            </div>
                        </section>
                        <section className="row-2">
                            <h4>Images: </h4>
                            <div>
                                <img src={property.image1_path} alt="" />
                            </div>
                        </section>
                        <section className="row-3">
                            <h4>Listings:</h4>
                            {listings.length > 0 ? (
                                <ul>
                                    <div>
                                        <strong>Listing ID</strong>
                                        <strong>Title</strong>
                                        <strong>Price</strong>
                                        <strong>Status</strong>
                                        <strong>Date Created</strong>
                                        <strong>Created By</strong>
                                    </div>
                                    {listings.map((listing) => {
                                        return (
                                            <li onClick={() => navigate(`/listings/${listing.id}`)}>
                                                <em>{listing.id}</em>
                                                <em>{listing.title}</em>
                                                {listing.listing_type === "FR" ? (
                                                    <em>Php {helperFn.insertComma(listing.price)} / mo.</em>
                                                ) : (
                                                    <em>Php {helperFn.insertComma(listing.price)}</em>
                                                )}
                                                <em>{listing.status_display}</em>
                                                <em>{listing.created_at.toString()}</em>
                                                {listing.agent_account ? (
                                                    <em>
                                                        <Link
                                                            to={`/agents/${listing.agent_account.user.username}`}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {listing.agent_account.agent_name}
                                                        </Link>
                                                    </em>
                                                ) : (
                                                    <em>You</em>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <div className="not-found">
                                    <em>No Listings</em>
                                </div>
                            )}
                        </section>
                        <section className="row-3">
                            <h4>Assigned Agents:</h4>
                            {propertyAgentAssignments.length > 0 ? (
                                <ul>
                                    <div>
                                        <strong>Agent ID</strong>
                                        <strong>Agent Name</strong>
                                        <strong>Date Added</strong>
                                    </div>

                                    {propertyAgentAssignments.map((assignment) => {
                                        return (
                                            <li onClick={() => navigate(`/agents/${assignment.agent.user.username}`)}>
                                                <em>{assignment.agent.pk}</em>
                                                <em>{assignment.agent.agent_name}</em>
                                                <em>{assignment.date_added}</em>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <div className="not-found">
                                    <em>No Assigned Agents</em>
                                </div>
                            )}
                        </section>
                    </section>
                </>
            ) : (
                <></>
            )}
        </main>
    );
}
