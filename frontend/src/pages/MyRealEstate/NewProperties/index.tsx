import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PropertyFormMessageStateType } from "../../../types/formMessages";
import { C_PROPERTIES } from "../../../constants/properties";
import useProperty from "../../../features/properties/hooks/useProperties";
import BtnBasicActive from "../../../components/Buttons/BtnBasicActive";
import BtnImageUpload from "../../../components/Buttons/BtnImageUpload";
import InputBasic from "../../../components/Forms/InputBasic";
import Message from "../../../components/Message";
import MyRealEstateHeader from "../components/MyRealEstateHeader";
import SelectWithLabel from "../../../components/Forms/SelectWithLabel";
import BtnLink from "../../../components/Buttons/BtnLink";
import "./index.css";

type PropertyCategoryOptionType = (typeof C_PROPERTIES.CATEGORY.OPTIONS)[keyof typeof C_PROPERTIES.CATEGORY.OPTIONS];

export default function NewProperties() {
    const [formMessages, setFormMessages] = useState<PropertyFormMessageStateType>({});
    const [image1_path, setImage1Path] = useState<File | string | null>(null);
    const [image2_path, setImage2Path] = useState<File | string | null>(null);
    const [image3_path, setImage3Path] = useState<File | string | null>(null);
    const [image4_path, setImage4Path] = useState<File | string | null>(null);
    const [image5_path, setImage5Path] = useState<File | string | null>(null);
    const [property_type, setPropertyType] = useState<PropertyCategoryOptionType>(
        C_PROPERTIES.CATEGORY.OPTIONS.HOUSE_AND_LOT
    );
    const navigateToProperties = useNavigate();
    const { createProperty } = useProperty();

    const imagePaths = [image1_path, image2_path, image3_path, image4_path, image5_path];
    const setImagePaths = [setImage1Path, setImage2Path, setImage3Path, setImage4Path, setImage5Path];

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

    function onChangeSelectOption(e: React.FormEvent<HTMLSelectElement>) {
        const selectedOption = e.currentTarget.value;
        const propertyCategory = Object.entries(C_PROPERTIES.CATEGORY.OPTIONS).filter(([, option]) => {
            return option.value === selectedOption;
        })[0][1];
        setPropertyType(propertyCategory);
    }

    return (
        <main id="new-properties-page">
            <MyRealEstateHeader>
                <h2>New Property</h2>
            </MyRealEstateHeader>
            <form id="new-properties-form" onSubmit={onSubmitForm}>
                <BtnLink onClick={() => navigateToProperties("/my-real-estate/properties")}>
                    {`<`} Back to Properties
                </BtnLink>
                {formMessages["detail"] && <Message type="error">{formMessages["detail"]}</Message>}
                <SelectWithLabel
                    label="Property Type"
                    selectProps={{
                        name: "property_type",
                        defaultValue: property_type.value,
                        "aria-placeholder": "Property Type",
                        onChange: onChangeSelectOption,
                    }}
                >
                    {C_PROPERTIES.CATEGORY.OPTIONS_LIST.map((propertyCategory, index) => {
                        return (
                            <option key={index} value={propertyCategory.value}>
                                {propertyCategory.text}
                            </option>
                        );
                    })}
                </SelectWithLabel>
                <div id="new-properties-address">
                    <label>Address</label>
                    {C_PROPERTIES.ADDRESS.HTML_CONFIG.map((config, index) => {
                        return (
                            <div key={index}>
                                <InputBasic name={config.name} placeholder={config.placeholder} />
                                {<Message type="error">{formMessages[config.name]?.[0]}</Message>}
                            </div>
                        );
                    })}
                </div>
                <div id="new-properties-details">
                    <label>Other Details</label>
                    <div>
                        {property_type.visible_details.map((detail, index) => {
                            return (
                                <div key={index}>
                                    <span>
                                        <i className={C_PROPERTIES.CATEGORY.SELECT_HTML[detail].i}></i>
                                        <InputBasic
                                            placeholder={C_PROPERTIES.CATEGORY.SELECT_HTML[detail].placeholder}
                                            type={C_PROPERTIES.CATEGORY.SELECT_HTML[detail].type}
                                            name={C_PROPERTIES.CATEGORY.SELECT_HTML[detail].name}
                                            min={0}
                                        />
                                    </span>

                                    {formMessages[detail] && <Message type="error">{formMessages[detail]}</Message>}
                                </div>
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
                                        imageFile={imagePath}
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
                        Add Property
                    </BtnBasicActive>
                </div>
            </form>
        </main>
    );
}
