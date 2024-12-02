import InputBasic from "../../../../../components/Forms/InputBasic";
import InputWithLabel from "../../../../../components/Forms/InputWithLabel";
import SelectWithLabel from "../../../../../components/Forms/SelectWithLabel";
import { ListingType } from "../../../../../features/listings/context/ListingsProvider";

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
};

export default function HeaderSection({ listing, setListing }: HeaderSectionProps) {
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
                </div>
                <div className="row row-2">
                    <InputWithLabel
                        inputProps={{
                            name: "price",
                            defaultValue: listing?.price,
                            type: "number",
                            placeholder: listing?.listing_type === "FR" ? "(Php / month)" : "(Php)",
                            min: 0,
                            onChange: (e) => setListing({ ...listing, price: checkNum(Number(e.currentTarget.value)) }),
                        }}
                    >
                        {listing?.listing_type === "FR" ? "Price / month" : "Price"}
                    </InputWithLabel>

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
                </div>
                <label>Address</label>
                <div className="row row-3">
                    <InputBasic
                        name="street"
                        defaultValue={listing?.street}
                        placeholder="Street"
                        onChange={(e) => setListing({ ...listing, street: e.currentTarget.value })}
                    />
                    <InputBasic
                        name="baranggay"
                        defaultValue={listing?.baranggay}
                        placeholder="Baranggay"
                        onChange={(e) => setListing({ ...listing, baranggay: e.currentTarget.value })}
                    />
                    <InputBasic
                        name="city"
                        defaultValue={listing?.city}
                        placeholder="City"
                        onChange={(e) => setListing({ ...listing, city: e.currentTarget.value })}
                    />
                    <InputBasic
                        name="province"
                        defaultValue={listing?.province}
                        placeholder="Province"
                        onChange={(e) => setListing({ ...listing, province: e.currentTarget.value })}
                    />
                </div>
            </div>
        </section>
    );
}
