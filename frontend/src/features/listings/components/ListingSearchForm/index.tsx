import BtnBasic from "../../../../components/Buttons/BtnBasic";
import SelectBasic from "../../../../components/Forms/SelectBasic";
import InputWithLabel from "../../../../components/Forms/InputWithLabel";
import "./index.css";
import BtnToggle from "../../../../components/Buttons/BtnToggle";
import { useState } from "react";

export default function ListingSearchForm() {
    const [isMoreOptionsVisible, setIsMoreOptionsVisible] = useState<boolean>(false);

    function showMoreOptions(e: React.MouseEvent<HTMLButtonElement>): void {
        e.preventDefault();
        setIsMoreOptionsVisible(true);
    }

    function hideMoreOptions(e: React.MouseEvent<HTMLButtonElement>): void {
        e.preventDefault();
        setIsMoreOptionsVisible(false);
    }

    return (
        <form id="listing-search-form">
            <div id="search-options-container">
                <SelectBasic
                    label={"Listing Type"}
                    selectProps={{ name: "listing-type" }}
                    labelProps={{ htmlFor: "listing-type" }}
                >
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                    <option value="Foreclosure">Foreclosure</option>
                </SelectBasic>

                <SelectBasic
                    label={"Property Type"}
                    selectProps={{ name: "property-type" }}
                    labelProps={{ htmlFor: "property-type" }}
                >
                    <option value="House and Lot">House and Lot</option>
                    <option value="Residential Lot">Residential Lot</option>
                    <option value="Commercial Lot">Commercial Lot</option>
                    <option value="Condominium">Condominium</option>
                </SelectBasic>

                <InputWithLabel name="province">Province</InputWithLabel>

                <InputWithLabel name="city">City</InputWithLabel>
            </div>
            {isMoreOptionsVisible ? (
                <>
                    <div id="more-options-container">
                        <p>Price Range:</p>
                        <div>
                            <InputWithLabel name="min-price">Min Price</InputWithLabel> <span>-</span>
                            <InputWithLabel name="max-price">Max Price</InputWithLabel>
                        </div>
                        <p>Area Range:</p>
                        <div>
                            <InputWithLabel name="min-area">Min Area</InputWithLabel> <span>-</span>
                            <InputWithLabel name="max-area">Max Area</InputWithLabel>
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
