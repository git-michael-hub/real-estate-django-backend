import InputBasic from "../../../../../components/Forms/InputBasic";
import TextAreaBasic from "../../../../../components/Forms/TextAreaBasic";
import Message from "../../../../../components/Message";
import { ListingFormMessageStateType, ListingType } from "../../../../../features/listings/context/ListingsProvider";
import "./index.css";

type DetailsSectionProps = {
    listing: ListingType | Partial<ListingType> | null;
    setListing: React.Dispatch<React.SetStateAction<ListingType | Partial<ListingType> | null>>;
    formMessages: ListingFormMessageStateType;
};

export default function DetailsSection({ listing, setListing, formMessages }: DetailsSectionProps) {
    function checkNum(num: number): number {
        try {
            if (num < 0) num = 0;
            return num;
        } catch (error) {
            return 0;
        }
    }

    return (
        <section className="listing-details">
            <div>
                <h3>Overview</h3>
                <div className="edit-listing-info">
                    <div>
                        <span>
                            <i className="fa-solid fa-expand"></i>{" "}
                            <InputBasic
                                placeholder="Property Size (sqm)"
                                type="number"
                                name="property_size"
                                min={0}
                                onChange={(e) =>
                                    setListing({ ...listing, property_size: Number(e.currentTarget.value) })
                                }
                                defaultValue={listing?.property_size}
                            />
                        </span>
                        {formMessages.property_size ? (
                            <Message type="error">{formMessages.property_size}</Message>
                        ) : (
                            <></>
                        )}
                    </div>
                    {listing?.property_type === "RL" ? (
                        <></>
                    ) : listing?.property_type === "CL" ? (
                        <></>
                    ) : (
                        <>
                            <div>
                                <span>
                                    <i className="fa-solid fa-bed"></i>
                                    <InputBasic
                                        placeholder="No. of bedrooms"
                                        type="number"
                                        name="bedrooms"
                                        min={0}
                                        onChange={(e) =>
                                            setListing({
                                                ...listing,
                                                bedrooms: checkNum(Number(e.currentTarget.value)),
                                            })
                                        }
                                        defaultValue={listing?.bedrooms}
                                    />
                                </span>
                                {formMessages.bedrooms ? (
                                    <Message type="error">{formMessages.bedrooms}</Message>
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div>
                                <span>
                                    <i className="fa-solid fa-shower"></i>
                                    <InputBasic
                                        placeholder="No. of bathrooms"
                                        type="number"
                                        name="bathrooms"
                                        min={0}
                                        onChange={(e) =>
                                            setListing({
                                                ...listing,
                                                bathrooms: checkNum(Number(e.currentTarget.value)),
                                            })
                                        }
                                        defaultValue={listing?.bathrooms}
                                    />
                                </span>
                                {formMessages.bathrooms ? (
                                    <Message type="error">{formMessages.bathrooms}</Message>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="listing-description">
                <h3>Description</h3>
                <TextAreaBasic
                    onChange={(e) => setListing({ ...listing, description: e.target.value })}
                    defaultValue={listing?.description}
                    name="description"
                />
                {formMessages.description ? <Message type="error">{formMessages.description}</Message> : <></>}
            </div>
        </section>
    );
}
