import useAuth from "../../../features/auth/hooks/useAuth";
import { apiFns, APIResponseType, HeaderType } from "../../../ts/api-service";
import cookieHandler, { Token } from "../../../ts/cookie-handler";
import { useNavigate } from "react-router-dom";
import { ListingType } from "../../../features/listings/context/ListingsProvider";
import BtnBasicActive from "../../../components/Buttons/BtnBasicActive";
import useListing from "../../../features/listings/hooks/useListings";
import HeaderSection from "../New/components/HeaderSection";
import ImageListSection from "../New/components/ImageListSection";
import DetailsSection from "../New/components/DetailsSection";
import { useEffect } from "react";

type EditProps = {
    listingId: number;
};

export default function Edit({ listingId }: EditProps) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { listing, setListing, fetchListing } = useListing();

    useEffect(() => {
        const init = async () => {
            const listing: ListingType | null | Partial<ListingType> = await fetchListing(`listings/${listingId}`);
            setListing(listing);
        };
        console.log(listing);

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
        const token: Token = cookieHandler.get("token");
        if (!token) return null;

        const formData = new FormData(e.currentTarget);
        appendImages(formData);

        const headers: HeaderType = { Authorization: `Token ${token}` };
        const response: APIResponseType = await apiFns.patch(`listings/${listingId}`, formData, headers);
        if (response.success) {
            const data: ListingType = response.data;
            navigate(`/listings/${data.id}`);
        }
    }

    return (
        <section id="new-listing">
            <form id="new-listing-container" onSubmit={submitForm}>
                <h3>Edit Listing</h3>

                <HeaderSection listing={listing} setListing={setListing}></HeaderSection>

                <ImageListSection listing={listing} setListing={setListing}></ImageListSection>

                <DetailsSection listing={listing} setListing={setListing}></DetailsSection>

                <input type="checkbox" name="is_available" defaultChecked={true} className="hidden" />
                <input type="hidden" name="seller" defaultValue={user?.id} />

                <BtnBasicActive id="create-new-listing-btn" type="submit">
                    Save Changes
                </BtnBasicActive>
            </form>
        </section>
    );
}
