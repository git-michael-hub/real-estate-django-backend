import useAuth from "../../../features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ListingFormMessageStateType, ListingType } from "../../../features/listings/context/ListingsProvider";
import BtnBasicActive from "../../../components/Buttons/BtnBasicActive";
import useListing from "../../../features/listings/hooks/useListings";
import HeaderSection from "../New/components/HeaderSection";
import ImageListSection from "../New/components/ImageListSection";
import DetailsSection from "../New/components/DetailsSection";
import { useEffect, useState } from "react";

type EditProps = {
    listingId: number;
};

export default function Edit({ listingId }: EditProps) {
    const navigate = useNavigate();
    const [formMessages, setFormMessages] = useState<ListingFormMessageStateType>({});
    const { user } = useAuth();
    const { listing, setListing, fetchListing, editListing } = useListing();

    useEffect(() => {
        const init = async () => {
            const listing: ListingType | null | Partial<ListingType> = await fetchListing(`${listingId}`);
            setListing(listing);
        };

        init();
    }, []);

    // appends the image to form data if an image data exists and is not a string type (it can either be string or File)
    // appends an empty file if no image data exists
    function appendImages(formData: FormData) {
        if (!listing) return;
        const keys: (keyof ListingType)[] = ["image1", "image2", "image3", "image4", "image5"];

        keys.forEach((key) => {
            if (listing[key]) typeof listing[key] !== "string" ? formData.append(key, listing[key] as File) : {};
            else formData.append(key, new File([], ""));
        });
    }

    async function submitForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        appendImages(formData);

        const response = await editListing(formData, listingId);
        if (response === null) return;
        if (response.success) {
            const data: ListingType = response.data;
            navigate(`/listings/${data.id}`);
        } else {
            setFormMessages(response.data);
        }
    }

    return (
        <section id="new-listing">
            <form id="new-listing-container" onSubmit={submitForm}>
                <h3>Edit Listing</h3>

                <HeaderSection listing={listing} setListing={setListing} formMessages={formMessages}></HeaderSection>

                <ImageListSection
                    listing={listing}
                    setListing={setListing}
                    formMessages={formMessages}
                ></ImageListSection>

                <DetailsSection listing={listing} setListing={setListing} formMessages={formMessages}></DetailsSection>

                <input type="checkbox" name="is_available" defaultChecked={true} className="hidden" />
                <input type="hidden" name="seller" defaultValue={user?.id} />

                <BtnBasicActive id="create-new-listing-btn" type="submit">
                    Save Changes
                </BtnBasicActive>
            </form>
        </section>
    );
}
