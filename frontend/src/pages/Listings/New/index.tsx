import useAuth from "../../../features/auth/hooks/useAuth";
import { apiFns, APIResponseType, HeaderType } from "../../../ts/api-service";
import cookieHandler, { Token } from "../../../ts/cookie-handler";
import { useNavigate } from "react-router-dom";
import { ListingType } from "../../../features/listings/context/ListingsProvider";
import BtnBasicActive from "../../../components/Buttons/BtnBasicActive";
import HeaderSection from "./components/HeaderSection";
import "./index.css";
import ImageListSection from "./components/ImageListSection";
import DetailsSection from "./components/DetailsSection";
import { useState } from "react";

export default function New() {
    const navigate = useNavigate();
    const [listing, setListing] = useState<ListingType | Partial<ListingType> | null>(null);
    const { user } = useAuth();

    async function submitForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const token: Token = cookieHandler.get("token");
        if (!token) return null;

        const formData = new FormData(e.currentTarget);
        if (user) formData.append("seller", user.id.toString());
        if (listing?.image1) formData.append("image1", listing?.image1);
        if (listing?.image2) formData.append("image2", listing?.image2);
        if (listing?.image3) formData.append("image3", listing?.image3);
        if (listing?.image4) formData.append("image4", listing?.image4);
        if (listing?.image5) formData.append("image5", listing?.image5);
        const headers: HeaderType = { Authorization: `Token ${token}` };
        const response: APIResponseType = await apiFns.post("listings/", formData, headers);
        if (response.success) {
            const data: ListingType = response.data;
            navigate(`/listings/${data.id}`);
        }
    }

    return (
        <section id="new-listing">
            <form id="new-listing-container" onSubmit={submitForm}>
                <h3>New Listing</h3>

                <HeaderSection listing={listing} setListing={setListing}></HeaderSection>

                <ImageListSection listing={listing} setListing={setListing}></ImageListSection>

                <DetailsSection listing={listing} setListing={setListing}></DetailsSection>

                <input type="checkbox" name="is_available" defaultChecked={true} className="hidden" />
                <input type="hidden" name="seller" defaultValue={user?.id} />

                <BtnBasicActive id="create-new-listing-btn" type="submit">
                    Save Listing
                </BtnBasicActive>
            </form>
        </section>
    );
}
