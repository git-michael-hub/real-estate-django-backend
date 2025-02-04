import InputBasic from "../../../../../components/Forms/InputBasic";
import InputWithLabel from "../../../../../components/Forms/InputWithLabel";
import SelectWithLabel from "../../../../../components/Forms/SelectWithLabel";
import Message from "../../../../../components/Message";
import { ListingFormMessageStateType, ListingType } from "../../../../../features/listings/context/ListingsProvider";
import "./index.css";

const LISTING_TYPE = {
    FS: "For Sale",
    FR: "For Rent",
    FC: "Foreclosure",
};

const PROPERTY_TYPE = {
    HL: "House and Lot",
    CO: "Condominium",
    RL: "Raw Lot",
    CL: "Commercial Lot",
};

type HeaderSectionProps = {
    listing: ListingType | Partial<ListingType> | null;
    setListing: React.Dispatch<React.SetStateAction<ListingType | Partial<ListingType> | null>>;
    formMessages: ListingFormMessageStateType;
};

export default function HeaderSection({ listing, setListing, formMessages }: HeaderSectionProps) {
    function checkNum(num: number): number {
        try {
            if (num < 0) num = 0;
            return num;
        } catch (error) {
            return 0;
        }
    }

    return (
        <section className="header-section">
            <div className="header-edit">
                <div className="row row-1">
                    <InputWithLabel
                        inputProps={{
                            name: "title",
                            defaultValue: listing?.title ? listing.title : "",
                            placeholder: "Listing Title",
                            onChange: (e) => setListing({ ...listing, title: e.currentTarget.value }),
                        }}
                    >
                        Title
                    </InputWithLabel>
                    {formMessages.title ? <Message type="error">{formMessages.title[0]}</Message> : <></>}
                </div>
                <div className="row row-2">
                    <div>
                        <InputWithLabel
                            inputProps={{
                                name: "price",
                                defaultValue: listing?.price,
                                type: "number",
                                placeholder: listing?.listing_type === "FR" ? "(Php / month)" : "(Php)",
                                min: 0,
                                onChange: (e) =>
                                    setListing({ ...listing, price: checkNum(Number(e.currentTarget.value)) }),
                            }}
                        >
                            {listing?.listing_type === "FR" ? "Price / month" : "Price"}
                        </InputWithLabel>
                        {formMessages.price ? <Message type="error">{formMessages.price[0]}</Message> : <></>}
                    </div>
                    <div>
                        <SelectWithLabel
                            label="Listing Type"
                            selectProps={{
                                name: "listing_type",
                                defaultValue: listing?.listing_type,
                                "aria-placeholder": "Listing Type",
                                onChange: (e) =>
                                    setListing({
                                        ...listing,
                                        listing_type: e.currentTarget.value as "FS" | "FR" | "FC",
                                    }),
                            }}
                        >
                            <option value="FS">{LISTING_TYPE["FS"]}</option>
                            <option value="FR">{LISTING_TYPE["FR"]}</option>
                            <option value="FC">{LISTING_TYPE["FC"]}</option>
                        </SelectWithLabel>
                        {formMessages.listing_type ? (
                            <Message type="error">{formMessages.listing_type}</Message>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div>
                        <SelectWithLabel
                            label="Property Type"
                            selectProps={{
                                name: "property_type",
                                defaultValue: listing?.property_type,
                                "aria-placeholder": "Property Type",
                                onChange: (e) =>
                                    setListing({
                                        ...listing,
                                        property_type: e.currentTarget.value as "HL" | "RL" | "CL" | "CO",
                                    }),
                            }}
                        >
                            <option value="HL">{PROPERTY_TYPE["HL"]}</option>
                            <option value="RL">{PROPERTY_TYPE["RL"]}</option>
                            <option value="CL">{PROPERTY_TYPE["CL"]}</option>
                            <option value="CO">{PROPERTY_TYPE["CO"]}</option>
                        </SelectWithLabel>
                        {formMessages.property_type ? (
                            <Message type="error">{formMessages.property_type}</Message>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
                <label>Address</label>
                <div className="row row-3">
                    <div>
                        <InputBasic
                            name="street"
                            defaultValue={listing?.street}
                            placeholder="Street"
                            onChange={(e) => setListing({ ...listing, street: e.currentTarget.value })}
                        />
                        {formMessages.street ? <Message type="error">{formMessages.street[0]}</Message> : <></>}
                    </div>
                    <div>
                        <InputBasic
                            name="baranggay"
                            defaultValue={listing?.baranggay}
                            placeholder="Baranggay"
                            onChange={(e) => setListing({ ...listing, baranggay: e.currentTarget.value })}
                        />
                        {formMessages.baranggay ? <Message type="error">{formMessages.baranggay[0]}</Message> : <></>}
                    </div>
                    <div>
                        <InputBasic
                            name="city"
                            defaultValue={listing?.city}
                            placeholder="City"
                            onChange={(e) => setListing({ ...listing, city: e.currentTarget.value })}
                        />
                        {formMessages.city ? <Message type="error">{formMessages.city[0]}</Message> : <></>}
                    </div>
                    <div>
                        <InputBasic
                            name="province"
                            defaultValue={listing?.province}
                            placeholder="Province"
                            onChange={(e) => setListing({ ...listing, province: e.currentTarget.value })}
                        />
                        {formMessages.province ? <Message type="error">{formMessages.province[0]}</Message> : <></>}
                    </div>
                </div>
            </div>
        </section>
    );
}
