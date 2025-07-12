import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { C_LISTINGS } from "../../../constants/listings";
import { C_PROPERTIES } from "../../../constants/properties";
import { ListingTypeDisplayType, ListingTypeType } from "../../../types/listing";
import { ListingFormMessageStateType } from "../../../types/formMessages";
import useProperty from "../../../features/properties/hooks/useProperties";
import useListing from "../../../features/listings/hooks/useListings";
import BtnBasicActive from "../../../components/Buttons/BtnBasicActive";
import InputBasic from "../../../components/Forms/InputBasic";
import Message from "../../../components/Message";
import MyRealEstateHeader from "../components/MyRealEstateHeader";
import SelectWithLabel from "../../../components/Forms/SelectWithLabel";
import BtnLink from "../../../components/Buttons/BtnLink";
import TextAreaBasic from "../../../components/Forms/TextAreaBasic";
import BtnBasicDisabled from "../../../components/Buttons/BtnBasicDisabled";
import "./index.css";

export default function NewListings() {
    const [formMessages, setFormMessages] = useState<ListingFormMessageStateType>({});
    const [listing_type, setListingType] = useState<ListingTypeType>("FS");
    const [isReady, setIsReady] = useState<boolean>(false);
    const navigateToListings = useNavigate();
    const {
        fetchPropertyAndUpdateState,
        property,
        setProperties,
        setProperty,
        fetchPropertiesAndUpdateState,
        properties,
    } = useProperty();
    const { createListingForSeller } = useListing();
    const location = useLocation();
    const { propertyId } = location.state;

    useEffect(() => {
        async function init() {
            setProperty(null);
            setProperties([]);
            if (propertyId) await fetchPropertyAndUpdateState(propertyId);
            await fetchPropertiesAndUpdateState("?sort_by=OTN");
            setIsReady(true);
        }

        init();
    }, []);

    async function onSubmitForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormMessages({});

        const formData: FormData = new FormData(e.currentTarget);
        const response = await createListingForSeller(formData);
        if (!response.success) return setFormMessages(response.err_messages as ListingFormMessageStateType);
        alert("Successfully created new listing.");
        navigateToListings("/my-real-estate/listings");
    }

    return (
        <main id="new-listings-page">
            <MyRealEstateHeader>
                <h2>New Listings</h2>
            </MyRealEstateHeader>
            <form id="new-listings-form" onSubmit={onSubmitForm}>
                <BtnLink onClick={() => navigateToListings("/my-real-estate/listings")}>{`<`} Back to Listings</BtnLink>
                {formMessages["detail"] && <Message type="error">{formMessages["detail"]}</Message>}
                {formMessages["error"] && <Message type="error">{formMessages["error"][0]}</Message>}
                <div>
                    <div>
                        <SelectWithLabel
                            label="Listing Type"
                            selectProps={{
                                name: "listing_type",
                                defaultValue: listing_type,
                                "aria-placeholder": "Listing Type",
                                onChange: (e) => setListingType(e.currentTarget.value as ListingTypeType),
                            }}
                        >
                            {(
                                Object.entries(C_LISTINGS.TYPES) as [
                                    keyof typeof C_LISTINGS.TYPES,
                                    { text: ListingTypeDisplayType; value: ListingTypeType }
                                ][]
                            ).map(([, listingType]) => {
                                return <option value={listingType.value}>{listingType.text}</option>;
                            })}
                        </SelectWithLabel>
                        <div id="new-listings-details">
                            <label>Details</label>
                            <div>
                                <InputBasic name="title" type="text" placeholder="Title" required />
                                {formMessages["title"] && <Message type="error">{formMessages["title"][0]}</Message>}
                            </div>
                            <div>
                                <InputBasic name="price" type="number" placeholder="Price (Php)" required />
                                {formMessages["price"] && <Message type="error">{formMessages["price"][0]}</Message>}
                            </div>
                            <div>
                                <TextAreaBasic name="description" placeholder="Description"></TextAreaBasic>
                                {formMessages["description"] && (
                                    <Message type="error">{formMessages["description"][0]}</Message>
                                )}
                            </div>
                        </div>
                        <div>
                            {property ? (
                                <BtnBasicActive id="add-new-listings-btn" type="submit">
                                    Add Listing
                                </BtnBasicActive>
                            ) : (
                                <BtnBasicDisabled id="add-new-listings-btn" type="submit">
                                    Add Listing
                                </BtnBasicDisabled>
                            )}
                        </div>
                    </div>
                    <div>
                        {isReady ? (
                            <>
                                <SelectWithLabel
                                    label="Property"
                                    selectProps={{
                                        name: "property",
                                        "aria-placeholder": "Property",
                                        defaultValue: propertyId,
                                        onChange: (e) => fetchPropertyAndUpdateState(e.currentTarget.value),
                                    }}
                                >
                                    <option disabled value={""}>
                                        -- select an option --
                                    </option>

                                    {properties ? (
                                        <>
                                            {properties.map((property) => {
                                                return (
                                                    <>
                                                        {C_PROPERTIES.ALLOWED_TO_EDIT_STATUS.includes(
                                                            property.status
                                                        ) ? (
                                                            <option value={property.id.toString()}>
                                                                {`(${property.id})`} {property.address}
                                                            </option>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </>
                                                );
                                            })}
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </SelectWithLabel>

                                {property ? (
                                    <div className="property-card">
                                        <img src={property.image1_path}></img>
                                        <span>
                                            <strong>Property ID:</strong> <em>{property.id}</em>
                                        </span>
                                        <span>
                                            <strong>Address:</strong> <address>{property.address}</address>
                                        </span>
                                        <span>
                                            <strong>Status:</strong> <em>{property.status_display}</em>
                                        </span>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </form>
        </main>
    );
}
