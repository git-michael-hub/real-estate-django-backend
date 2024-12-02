import { Link } from "react-router-dom";
import BtnBasicActive from "../../../../../components/Buttons/BtnBasicActive";
import Tag from "../../../../../components/Tag";
import useListing from "../../../../../features/listings/hooks/useListings";
import PageBtns from "../../../../../components/PageBtns";
import "./index.css";

type ListingTableProps = {
    onClickEdit(listingId: number): void;
    onClickDelete(listingId: number): void;
};

export default function ListingTable({ onClickEdit, onClickDelete }: ListingTableProps) {
    const { listings, page, pages, nextPageLink, previousPageLink, fetchListingsAndUpdateState } = useListing();

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
                                    </div>
                                    <div>
                                        <Tag className="tag-1">{listing.listing_type_display}</Tag>
                                    </div>
                                    <div>
                                        <Tag className="tag-2">{listing.property_type_display}</Tag>
                                    </div>
                                    <div>
                                        <input
                                            type="checkbox"
                                            id="is_available"
                                            name="is_available"
                                            defaultChecked={listing.is_available}
                                        />
                                    </div>
                                    <div>
                                        <BtnBasicActive onClick={() => onClickEdit(listing.id)}>Edit</BtnBasicActive>
                                    </div>
                                    <div>
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