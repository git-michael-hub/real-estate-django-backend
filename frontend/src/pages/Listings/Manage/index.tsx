import { Link } from "react-router-dom";
import BtnBasic from "../../../components/Buttons/BtnBasic";
import "./index.css";
import useAuth from "../../../features/auth/hooks/useAuth";
import useListing from "../../../features/listings/hooks/useListings";
import { useEffect, useState } from "react";
import Tag from "../../../components/Tag";
import PageBtns from "../../../components/PageBtns";
import BtnIconRound from "../../../components/Buttons/BtnIconRound";
import New from "../New";
import BtnBasicActive from "../../../components/Buttons/BtnBasicActive";

export default function Manage() {
    const [activeTab, setActiveTab] = useState<"ML" | "CL">("ML");
    const [isDeleteFormActive, setIsDeleteFormActive] = useState<boolean>(false);
    const [deleteItem, setDeleteItem] = useState<number | null>(null);
    const { user } = useAuth();
    const {
        listings,
        page,
        pages,
        nextPageLink,
        previousPageLink,
        setListings,
        fetchListingsAndUpdateState,
        deleteListing,
    } = useListing();

    useEffect(() => {
        const init = async () => {
            await fetchListingsAndUpdateState(`?username=${user?.username}`);
        };

        init();
    }, []);

    function onOpenDeleteForm(listingId: number) {
        setDeleteItem(listingId);
        setIsDeleteFormActive(true);
    }

    async function onDeleteListing(e: React.FormEvent<HTMLFormElement>, listingId: number | null): Promise<void> {
        e.preventDefault();

        if (!listingId) return;

        const isDeleted: boolean = await deleteListing(listingId);
        if (isDeleted) {
            const newListing = listings.map((listing) => {
                if (listing.id === listingId) {
                    listing["DELETED"] = true;
                    return listing;
                } else return listing;
            });
            setListings(newListing);
            setDeleteItem(null);
            setIsDeleteFormActive(false);
            return alert("Successfully deleted listing.");
        } else return alert("An error occurred.");
    }

    return (
        <>
            <main id="manage-listings-page">
                <div>
                    <header>
                        <h2>Manage Listings</h2>
                        <div className="row-2">
                            <nav>
                                {activeTab === "ML" ? (
                                    <>
                                        <BtnBasicActive onClick={() => setActiveTab("ML")}>My Listings</BtnBasicActive>
                                        <BtnBasic onClick={() => setActiveTab("CL")}>Create Listings</BtnBasic>
                                    </>
                                ) : activeTab === "CL" ? (
                                    <>
                                        <BtnBasic onClick={() => setActiveTab("ML")}>My Listings</BtnBasic>
                                        <BtnBasicActive onClick={() => setActiveTab("CL")}>
                                            Create Listings
                                        </BtnBasicActive>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </nav>
                            <div>
                                <BtnIconRound>
                                    <i className="fa-solid fa-arrow-up-wide-short"></i>
                                </BtnIconRound>
                                <BtnIconRound>
                                    <i className="fa-solid fa-filter"></i>
                                </BtnIconRound>
                            </div>
                        </div>
                    </header>
                    {activeTab === "ML" ? (
                        <>
                            <div id="table-header">
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

                            <ul id="listings">
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
                                                        <img src={listing.image1} alt="" />
                                                    </div>
                                                    <div className="title">
                                                        <h3>
                                                            <Link to={`/listings/${listing.id}`}>{listing.title}</Link>
                                                        </h3>
                                                        <span>
                                                            {listing.street}, {listing.baranggay}, {listing.city},{" "}
                                                            {listing.province}
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
                                                        <BtnBasicActive>Edit</BtnBasicActive>
                                                    </div>
                                                    <div>
                                                        <BtnBasicActive onClick={() => onOpenDeleteForm(listing.id)}>
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
                    ) : activeTab === "CL" ? (
                        <New></New>
                    ) : (
                        <></>
                    )}
                </div>
            </main>
            {isDeleteFormActive ? (
                <div id="background-mask">
                    <form id="delete-form" onSubmit={(e) => onDeleteListing(e, deleteItem)}>
                        <p>Confirm Delete</p>
                        <div>
                            <BtnBasicActive type="submit">Delete</BtnBasicActive>
                            <BtnBasicActive type="button" onClick={() => setIsDeleteFormActive(false)}>
                                Cancel
                            </BtnBasicActive>
                        </div>
                    </form>
                </div>
            ) : (
                <></>
            )}
        </>
    );
}
