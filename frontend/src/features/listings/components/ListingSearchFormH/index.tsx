import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BtnBasic from "../../../../components/Buttons/BtnBasic";
import SelectBasic from "../../../../components/Forms/SelectBasic";
import InputBasic from "../../../../components/Forms/InputBasic";
import "./index.css";

export default function ListingSearchFormH() {
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
        <form id="listing-search-form-h" onSubmit={submitSearchForm}>
            <div id="search-options-container">
                <SelectBasic name="listing_type" aria-placeholder="Listing Type">
                    <option value="FS">For Sale</option>
                    <option value="FR">For Rent</option>
                    <option value="FC">Foreclosure</option>
                </SelectBasic>

                <SelectBasic name="property_type" aria-placeholder="Property Type">
                    <option value="HL">House and Lot</option>
                    <option value="RL">Residential Lot</option>
                    <option value="CL">Commercial Lot</option>
                    <option value="CO">Condominium</option>
                </SelectBasic>

                <InputBasic name="province" placeholder="Province">
                    Province
                </InputBasic>

                <InputBasic name="city" placeholder="City">
                    City
                </InputBasic>
            </div>

            <div className="button-container">
                {isMoreOptionsVisible ? (
                    <BtnBasic onClick={hideMoreOptions}>
                        <i className="fa-solid fa-caret-down"></i>
                        <span>Hide Options</span>
                    </BtnBasic>
                ) : (
                    <BtnBasic onClick={showMoreOptions}>
                        <i className="fa-solid fa-caret-right"></i>
                        <span>Show More Options</span>
                    </BtnBasic>
                )}

                <BtnBasic type="submit">Search</BtnBasic>
            </div>
            {isMoreOptionsVisible ? (
                <div id="more-options-container">
                    <div>
                        <p>Price Range:</p>
                        <div>
                            <InputBasic name="min_price" type="number" placeholder="Min Price"></InputBasic>
                            <InputBasic name="max_price" type="number" placeholder="Max Price"></InputBasic>
                        </div>
                    </div>

                    <div>
                        <p>Area Range:</p>
                        <div>
                            <InputBasic name="min_area" type="number" placeholder="Min Area"></InputBasic>
                            <InputBasic name="max_area" type="number" placeholder="Max Area"></InputBasic>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </form>
    );
}
