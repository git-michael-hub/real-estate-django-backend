import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PropertyFormMessageStateType } from "../../../features/properties/context/PropertiesProvider";
import { PropertyTypeType } from "../../../types/property";
import useProperty from "../../../features/properties/hooks/useProperties";
import BtnBasicActive from "../../../components/Buttons/BtnBasicActive";
import BtnImageUpload from "../../../components/Buttons/BtnImageUpload";
import InputBasic from "../../../components/Forms/InputBasic";
import Message from "../../../components/Message";
import MyRealEstateHeader from "../components/MyRealEstateHeader";
import SelectWithLabel from "../../../components/Forms/SelectWithLabel";
import BtnLink from "../../../components/Buttons/BtnLink";
import "./index.css";

const PROPERTY_TYPE = {
    HL: "House and Lot",
    CO: "Condominium",
    RL: "Raw Lot",
    CL: "Commercial Lot",
} as const;

const PROPERTY_ADDRESS_HTML_CONFIG = {
    street: { pk: 1, placeholder: "Street", type: "text", name: "street" },
    barangay: { pk: 2, placeholder: "Barangay", type: "text", name: "barangay" },
    city: { pk: 3, placeholder: "City", type: "text", name: "city" },
    province: { pk: 4, placeholder: "Province", type: "text", name: "province" },
} as const;

const PROPERTY_TYPE_DETAILS_VISIBILITY = {
    HL: { bedrooms: true, bathrooms: true, lot_area: true, floor_area: true, num_of_floors: true },
    CO: { bedrooms: true, bathrooms: true, lot_area: false, floor_area: true, num_of_floors: true },
    RL: { bedrooms: false, bathrooms: false, lot_area: true, floor_area: false, num_of_floors: false },
    CL: { bedrooms: false, bathrooms: false, lot_area: true, floor_area: false, num_of_floors: false },
} as const;

const PROPERTY_DETAILS_HTML_CONFIG = {
    bedrooms: { pk: 1, placeholder: "No. of bedrooms", type: "number", name: "bedrooms", i: "fa-solid fa-bed" },
    bathrooms: { pk: 2, placeholder: "No. of bathrooms", type: "number", name: "bathrooms", i: "fa-solid fa-shower" },
    lot_area: { pk: 3, placeholder: "Lot Area (sqm)", type: "number", name: "lot_area", i: "fa-solid fa-expand" },
    floor_area: {
        pk: 4,
        placeholder: "Floor Area (sqm)",
        type: "number",
        name: "floor_area",
        i: "fa-solid fa-chart-area",
    },
    num_of_floors: {
        pk: 5,
        placeholder: "No. of Floors",
        type: "number",
        name: "num_of_floors",
        i: "fa-solid fa-layer-group",
    },
} as const;

type ImagePathKeysType = "image1_path" | "image2_path" | "image3_path" | "image4_path" | "image5_path";

export default function EditProperties() {
    const [formMessages, setFormMessages] = useState<PropertyFormMessageStateType>({});
    const [image1_path, setImage1Path] = useState<File | string | null>(null);
    const [image2_path, setImage2Path] = useState<File | string | null>(null);
    const [image3_path, setImage3Path] = useState<File | string | null>(null);
    const [image4_path, setImage4Path] = useState<File | string | null>(null);
    const [image5_path, setImage5Path] = useState<File | string | null>(null);
    const [property_type, setPropertyType] = useState<PropertyTypeType>("HL");
    const navigateToProperties = useNavigate();
    const navigateBack = useNavigate();
    const location = useLocation();
    const data = location.state;
    const { property, createProperty, fetchPropertyAndUpdateState } = useProperty();

    const imagePaths = [image1_path, image2_path, image3_path, image4_path, image5_path];
    const setImagePaths = [setImage1Path, setImage2Path, setImage3Path, setImage4Path, setImage5Path];

    useEffect(() => {
        async function init() {
            if (data.propertyId) {
                await fetchPropertyAndUpdateState(data.propertyId);
            }
        }

        init();
    }, []);

    async function onSubmitForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormMessages({});

        const formData: FormData = new FormData(e.currentTarget);
        if (image1_path) formData.append("image1_path", image1_path);
        if (image2_path) formData.append("image2_path", image2_path);
        if (image3_path) formData.append("image3_path", image3_path);
        if (image4_path) formData.append("image4_path", image4_path);
        if (image5_path) formData.append("image5_path", image5_path);

        const response = await createProperty(formData);
        if (!response.success) return setFormMessages(response.err_messages as PropertyFormMessageStateType);
        alert("Successfully created new property.");
        navigateToProperties("/my-real-estate/properties");
    }

    return (
        <>
            {property ? (
                <main id="new-properties-page">
                    <MyRealEstateHeader>
                        <h2>Edit Property</h2>
                    </MyRealEstateHeader>
                    <form id="new-properties-form" onSubmit={onSubmitForm}>
                        <BtnLink onClick={() => navigateBack(-1)}>{`<`} Back</BtnLink>
                        {formMessages["detail"] && <Message type="error">{formMessages["detail"]}</Message>}
                        <SelectWithLabel
                            label="Property Type"
                            selectProps={{
                                name: "property_type",
                                defaultValue: property?.property_type,
                                "aria-placeholder": "Property Type",
                                onChange: (e) => setPropertyType(e.currentTarget.value as PropertyTypeType),
                            }}
                        >
                            <option value="HL">{PROPERTY_TYPE.HL}</option>
                            <option value="RL">{PROPERTY_TYPE.RL}</option>
                            <option value="CL">{PROPERTY_TYPE.CL}</option>
                            <option value="CO">{PROPERTY_TYPE.CO}</option>
                        </SelectWithLabel>
                        <div id="new-properties-address">
                            <label>Address</label>
                            {(
                                Object.keys(
                                    PROPERTY_ADDRESS_HTML_CONFIG
                                ) as (keyof typeof PROPERTY_ADDRESS_HTML_CONFIG)[]
                            ).map((address_detail) => {
                                return (
                                    <div key={PROPERTY_ADDRESS_HTML_CONFIG[address_detail].pk}>
                                        <InputBasic
                                            name={PROPERTY_ADDRESS_HTML_CONFIG[address_detail].name}
                                            placeholder={PROPERTY_ADDRESS_HTML_CONFIG[address_detail].placeholder}
                                            defaultValue={property[address_detail]}
                                        />
                                        {formMessages[address_detail] && (
                                            <Message type="error">{formMessages[address_detail][0]}</Message>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div id="new-properties-details">
                            <label>Other Details</label>
                            <div>
                                {(
                                    Object.keys(
                                        PROPERTY_DETAILS_HTML_CONFIG
                                    ) as (keyof typeof PROPERTY_DETAILS_HTML_CONFIG)[]
                                ).map((detail) => {
                                    return PROPERTY_TYPE_DETAILS_VISIBILITY[property_type][detail] ? (
                                        <div key={PROPERTY_DETAILS_HTML_CONFIG[detail].pk}>
                                            <span>
                                                <i className={PROPERTY_DETAILS_HTML_CONFIG[detail].i}></i>
                                                <InputBasic
                                                    placeholder={PROPERTY_DETAILS_HTML_CONFIG[detail].placeholder}
                                                    type={PROPERTY_DETAILS_HTML_CONFIG[detail].type}
                                                    name={PROPERTY_DETAILS_HTML_CONFIG[detail].name}
                                                    min={0}
                                                    defaultValue={property[detail]}
                                                />
                                            </span>

                                            {formMessages[detail] && (
                                                <Message type="error">{formMessages[detail]}</Message>
                                            )}
                                        </div>
                                    ) : (
                                        <></>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="property-image-list">
                            <label>Images</label>
                            <div>
                                {imagePaths.map((imagePath, index) => {
                                    return (
                                        <div key={index}>
                                            <BtnImageUpload
                                                imageFile={property[`image${index + 1}_path` as ImagePathKeysType]}
                                                inputProps={{
                                                    onChange: (e) =>
                                                        e.target.files ? setImagePaths[index](e.target.files[0]) : {},
                                                }}
                                                buttonProps={{ onClick: () => setImagePaths[index](null) }}
                                            ></BtnImageUpload>
                                            {formMessages[imagePath?.toString() as keyof typeof imagePath] ? (
                                                <Message type="error">
                                                    {formMessages[imagePath?.toString() as keyof typeof imagePath][0]}
                                                </Message>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <BtnBasicActive id="add-new-properties-btn" type="submit">
                                Save Changes
                            </BtnBasicActive>
                        </div>
                    </form>
                </main>
            ) : (
                <></>
            )}
        </>
    );
}
