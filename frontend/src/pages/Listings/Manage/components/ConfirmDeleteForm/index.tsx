import BtnBasicActive from "../../../../../components/Buttons/BtnBasicActive";
import useListing from "../../../../../features/listings/hooks/useListings";
import "./index.css";

type ConfirmDeleteFormProps = {
    listingId: number | null;
    setIsConfirmDeleteFormActive: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ConfirmDeleteForm({ listingId, setIsConfirmDeleteFormActive }: ConfirmDeleteFormProps) {
    const { listings, setListings, deleteListing } = useListing();

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
            setIsConfirmDeleteFormActive(false);
            return alert("Successfully deleted listing.");
        } else return alert("An error occurred.");
    }

    return (
        <div id="background-mask">
            <form id="confirm-delete-form" onSubmit={(e) => onDeleteListing(e, listingId)}>
                <p>Confirm Delete</p>
                <div>
                    <BtnBasicActive type="submit">Delete</BtnBasicActive>
                    <BtnBasicActive type="button" onClick={() => setIsConfirmDeleteFormActive(false)}>
                        Cancel
                    </BtnBasicActive>
                </div>
            </form>
        </div>
    );
}
