import useAuth from "../../../features/auth/hooks/useAuth";
import { apiFns, APIResponseType, HeaderType } from "../../../utils/api-service";
import cookieHandler, { Token } from "../../../utils/cookie-handler";
import { useNavigate } from "react-router-dom";
import BtnBasicActive from "../../../components/Buttons/BtnBasicActive";
import HeaderSection from "./components/HeaderSection";
import ImageListSection from "./components/ImageListSection";
import DetailsSection from "./components/DetailsSection";
import { useState } from "react";
import "./index.css";
import { ListingType } from "../../../types/transaction";
import { ListingFormMessageStateType } from "../../../types/listing";
import { API_URLS } from "../../../urls/api-urls";

export default function New() {
    const navigate = useNavigate();
    const [listing, setListing] = useState<ListingType | Partial<ListingType> | null>(null);
    const [formMessages, setFormMessages] = useState<ListingFormMessageStateType>({});
    const { user } = useAuth();

    async function submitForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const token: Token = cookieHandler.get("token");
        if (!token) return null;

        const formData = new FormData(e.currentTarget);
        if (user) formData.append("seller", user.id.toString());
        if (listing?.image1_path) formData.append("image1_path", listing?.image1_path);
        if (listing?.image2_path) formData.append("image2_path", listing?.image2_path);
        if (listing?.image3_path) formData.append("image3_path", listing?.image3_path);
        if (listing?.image4_path) formData.append("image4_path", listing?.image4_path);
        if (listing?.image5_path) formData.append("image5_path", listing?.image5_path);
        const headers: HeaderType = { Authorization: `Token ${token}` };
        try {
            const response: APIResponseType = await apiFns.post(API_URLS.LISTING.CREATE(), formData, headers);
            if (response.success) {
                const data: ListingType = response.data;
                navigate(`/listings/${data.id}`);
                alert("Successfully created listing.");
            } else setFormMessages(response.data);
        } catch (error) {
            alert("An error has occurred.");
        }
    }

    return (
        <section id="new-listing">
            <form id="new-listing-container" onSubmit={submitForm}>
                <h3>New Listing</h3>

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
                    Save Listing
                </BtnBasicActive>
            </form>
        </section>
    );
}
