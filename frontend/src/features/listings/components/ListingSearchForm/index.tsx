import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BtnBasic from "../../../../components/Buttons/BtnBasic";
import SelectWithLabel from "../../../../components/Forms/SelectWithLabel";
import InputWithLabel from "../../../../components/Forms/InputWithLabel";
import BtnToggle from "../../../../components/Buttons/BtnToggle";
import "./index.css";

export default function ListingSearchForm() {
    const [isMoreOptionsVisible, setIsMoreOptionsVisible] = useState<boolean>(false);
    const navigate = useNavigate();

    function showMoreOptions(e: React.MouseEvent<HTMLButtonElement>): void {
        e.preventDefault();
        setIsMoreOptionsVisible(true);
    }

    function hideMoreOptions(e: React.MouseEvent<HTMLButtonElement>): void {
        e.preventDefault();
        setIsMoreOptionsVisible(false);
    }

    function submitSearchForm(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        const formData: FormData = new FormData(e.currentTarget);
        const params: URLSearchParams = new URLSearchParams(formData as any); // NO WORK AROUND FOR THIS YET
        navigate(`/listings/?${params.toString()}`);
    }

    return (
        <form id="listing-search-form" onSubmit={submitSearchForm}>
            <div id="search-options-container">
                <SelectWithLabel
                    label="Listing Type"
                    selectProps={{ name: "listing_type" }}
                    labelProps={{ htmlFor: "listing_type" }}
                >
                    <option value="FS">For Sale</option>
                    <option value="FR">For Rent</option>
                    <option value="FC">Foreclosure</option>
                </SelectWithLabel>

                <SelectWithLabel
                    label="Property Type"
                    selectProps={{ name: "property_type" }}
                    labelProps={{ htmlFor: "property_type" }}
                >
                    <option value="HL">House and Lot</option>
                    <option value="RL">Residential Lot</option>
                    <option value="CL">Commercial Lot</option>
                    <option value="CO">Condominium</option>
                </SelectWithLabel>

                <InputWithLabel inputProps={{ name: "province" }}>Province</InputWithLabel>

                <InputWithLabel inputProps={{ name: "city" }}>City</InputWithLabel>
            </div>

            {isMoreOptionsVisible ? (
                <>
                    <div id="more-options-container">
                        <p>Price Range:</p>
                        <div>
                            <InputWithLabel inputProps={{ name: "min_price", type: "number" }}>
                                Min Price
                            </InputWithLabel>
                            <span>-</span>
                            <InputWithLabel inputProps={{ name: "max_price", type: "number" }}>
                                Max Price
                            </InputWithLabel>
                        </div>

                        <p>Area Range:</p>
                        <div>
                            <InputWithLabel inputProps={{ name: "min_area", type: "number" }}>Min Area</InputWithLabel>
                            <span>-</span>
                            <InputWithLabel inputProps={{ name: "max_area", type: "number" }}>Max Area</InputWithLabel>
                        </div>
                    </div>

                    <div id="more-options-btn-container">
                        <BtnToggle onClick={hideMoreOptions}>
                            <i className="fa-solid fa-caret-up"></i>
                            <span>Hide More Options</span>
                        </BtnToggle>
                    </div>
                </>
            ) : (
                <div id="more-options-btn-container">
                    <BtnToggle onClick={showMoreOptions}>
                        <i className="fa-solid fa-caret-right"></i>
                        <span>Show More Options</span>
                    </BtnToggle>
                </div>
            )}

            <BtnBasic type="submit">Search</BtnBasic>
        </form>
    );
}
