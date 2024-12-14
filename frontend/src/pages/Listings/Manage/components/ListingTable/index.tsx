import { Link } from "react-router-dom";
import BtnBasicActive from "../../../../../components/Buttons/BtnBasicActive";
import useListing from "../../../../../features/listings/hooks/useListings";
import PageBtns from "../../../../../components/PageBtns";
import "./index.css";
import cookieHandler, { Token } from "../../../../../ts/cookie-handler";
import { apiFns, APIResponseType, HeaderType } from "../../../../../ts/api-service";

type ListingTableProps = {
    onClickEdit(listingId: number): void;
    onClickDelete(listingId: number): void;
};

export default function ListingTable({ onClickEdit, onClickDelete }: ListingTableProps) {
    const { listings, page, pages, nextPageLink, previousPageLink, fetchListingsAndUpdateState } = useListing();

    async function onToggleAvailability(e: React.ChangeEvent<HTMLInputElement>) {
        const formData: FormData = new FormData();
        formData.append("is_available", e.currentTarget.checked.toString());

        const token: Token = cookieHandler.get("token");
        if (!token) return null;

        const headers: HeaderType = { Authorization: `Token ${token}` };
        try {
            const response: APIResponseType = await apiFns.patch(`listings/${e.currentTarget.id}`, formData, headers);
            if (!response.success) alert("Failed to update listing.");
        } catch {
            alert("Failed to update listing.");
        }
    }

    return (
        <>
            <div id="listing-table-header">
                <div>
                    <input type="checkbox" />
                </div>
                <div>
                    <b>Image</b>
                </div>
                <div>
                    <b>Title</b>
                </div>
                <div>
                    <b>Listing Type</b>
                </div>
                <div>
                    <b>Property Type</b>
                </div>
                <div>
                    <b>Availability</b>
                </div>
                <div>
                    <b>Edit</b>
                </div>
                <div>
                    <b>Delete</b>
                </div>
            </div>
            <ul id="listing-table">
                {listings.map((listing) => {
                    return (
                        <li key={listing.id}>
                            {listing.DELETED ? (
                                <div className="deleted-listing">This item is deleted.</div>
                            ) : (
                                <>
                                    <div>
                                        <input type="checkbox" />
                                    </div>
                                    <div>
                                        <img src={listing.image1 as string} alt="" />
                                    </div>
                                    <div className="title">
                                        <h3>
                                            <Link to={`/listings/${listing.id}`}>{listing.title}</Link>
                                        </h3>
                                        <span>
                                            {listing.street}, {listing.baranggay}, {listing.city}, {listing.province}
                                        </span>
                                        <span className="date-posted">
                                            Date Posted:{" "}
                                            {`${new Date(listing.created_at).getMonth()}/${new Date(
                                                listing.created_at
                                            ).getDate()}/${new Date(listing.created_at).getFullYear()}`}
                                        </span>
                                    </div>
                                    <div>
                                        {listing.listing_type === "FS" ? (
                                            <span className="listing-type-fs">{listing.listing_type_display}</span>
                                        ) : listing.listing_type === "FR" ? (
                                            <span className="listing-type-fr">{listing.listing_type_display}</span>
                                        ) : (
                                            <span className="listing-type-fc">{listing.listing_type_display}</span>
                                        )}
                                    </div>
                                    <div>
                                        {listing.property_type === "HL" ? (
                                            <span className="property-type-hl">{listing.property_type_display}</span>
                                        ) : listing.property_type === "CO" ? (
                                            <span className="property-type-co">{listing.property_type_display}</span>
                                        ) : listing.property_type === "RL" ? (
                                            <span className="property-type-rl">{listing.property_type_display}</span>
                                        ) : (
                                            <span className="property-type-cl">{listing.property_type_display}</span>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="checkbox"
                                            id={listing.id.toString()}
                                            name="is_available"
                                            defaultChecked={listing.is_available}
                                            onChange={onToggleAvailability}
                                        />
                                    </div>
                                    <div>
                                        <BtnBasicActive onClick={() => onClickEdit(listing.id)}>Edit</BtnBasicActive>
                                    </div>
                                    <div className="delete-btn-container">
                                        <BtnBasicActive onClick={() => onClickDelete(listing.id)}>
                                            Delete
                                        </BtnBasicActive>
                                    </div>
                                </>
                            )}
                        </li>
                    );
                })}
            </ul>
            <PageBtns
                page={page}
                pages={pages}
                previousPageLink={previousPageLink}
                nextPageLink={nextPageLink}
                action={fetchListingsAndUpdateState}
                enableNavigate={false}
            />
        </>
    );
}
