import { useEffect, useState } from "react";
import BtnBasicActive from "../../../components/Buttons/BtnBasicActive";
import InputBasic from "../../../components/Forms/InputBasic";
import Message from "../../../components/Message";
import MyRealEstateHeader from "../components/MyRealEstateHeader";
import SelectWithLabel from "../../../components/Forms/SelectWithLabel";
import "./index.css";
import BtnLink from "../../../components/Buttons/BtnLink";
import { useLocation, useNavigate } from "react-router-dom";
import useListing from "../../../features/listings/hooks/useListings";
import { ListingFormMessageStateType } from "../../../types/formMessages";
import TextAreaBasic from "../../../components/Forms/TextAreaBasic";

const LISTING_TYPE = {
    FS: "For Sale",
    FR: "For Rent",
    FC: "Foreclosure",
} as const;

export default function EditListings() {
    const [formMessages, setFormMessages] = useState<ListingFormMessageStateType>({});
    const navigateBack = useNavigate();
    const location = useLocation();
    const data = location.state;
    const { listing, editListingForSeller, getOneListingForSeller } = useListing();

    useEffect(() => {
        async function init() {
            if (data.listingId) {
                await getOneListingForSeller(data.listingId);
            }
        }

        init();
    }, []);

    async function onSubmitForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormMessages({});

        if (listing) {
            const formData: FormData = new FormData(e.currentTarget);
            const response = await editListingForSeller(formData, listing.id);
            if (!response.success) return setFormMessages(response.err_messages as ListingFormMessageStateType);
            alert("Successfully saved changes to listing.");
        }
    }

    return (
        <>
            {listing ? (
                <main id="edit-listings-page">
                    <MyRealEstateHeader>
                        <h2>Edit Listing</h2>
                    </MyRealEstateHeader>
                    <form id="edit-listings-form" onSubmit={onSubmitForm}>
                        <BtnLink onClick={() => navigateBack("/my-real-estate/listings")}>
                            {`<`} Back to Listings
                        </BtnLink>
                        {formMessages["detail"] && <Message type="error">{formMessages["detail"]}</Message>}
                        <div>
                            <div>
                                <div>
                                    <h3>Listing ID: {listing.id}</h3>
                                </div>
                                <SelectWithLabel
                                    label="Listing Type"
                                    selectProps={{
                                        name: "listing_type",
                                        defaultValue: listing.listing_type,
                                        "aria-placeholder": "Listing Type",
                                    }}
                                >
                                    <option value="FS">{LISTING_TYPE.FS}</option>
                                    <option value="FR">{LISTING_TYPE.FR}</option>
                                    <option value="FC">{LISTING_TYPE.FC}</option>
                                </SelectWithLabel>
                                <div id="edit-listings-details">
                                    <label>Details</label>
                                    <div>
                                        <InputBasic
                                            name="title"
                                            type="text"
                                            placeholder="Title"
                                            defaultValue={listing.title}
                                            required
                                        />
                                        {formMessages["title"] && (
                                            <Message type="error">{formMessages["title"][0]}</Message>
                                        )}
                                    </div>
                                    <div>
                                        <InputBasic
                                            name="price"
                                            type="number"
                                            placeholder="Price (Php)"
                                            defaultValue={listing.price}
                                            required
                                        />
                                        {formMessages["price"] && (
                                            <Message type="error">{formMessages["price"][0]}</Message>
                                        )}
                                    </div>
                                    <div>
                                        <TextAreaBasic
                                            name="description"
                                            placeholder="Description"
                                            defaultValue={listing.description}
                                        ></TextAreaBasic>
                                        {formMessages["description"] && (
                                            <Message type="error">{formMessages["description"][0]}</Message>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <BtnBasicActive id="edit-listings-btn" type="submit">
                                        Save Changes
                                    </BtnBasicActive>
                                </div>
                            </div>
                            <div>
                                {listing.property ? (
                                    <div className="property-card">
                                        <img src={listing.property.image1_path}></img>
                                        <span>
                                            <strong>Property ID:</strong> <em>{listing.property.id}</em>
                                        </span>
                                        <span>
                                            <strong>Address:</strong> <address>{listing.property.address}</address>
                                        </span>
                                        <span>
                                            <strong>Status:</strong> <em>{listing.property.status_display}</em>
                                        </span>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                    </form>
                </main>
            ) : (
                <></>
            )}
        </>
    );
}
