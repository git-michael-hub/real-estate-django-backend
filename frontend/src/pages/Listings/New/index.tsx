import BtnBasic from "../../../components/Buttons/BtnBasic";
import InputWithLabel from "../../../components/Forms/InputWithLabel";
import SelectBasic from "../../../components/Forms/SelectBasic";
import useAuth from "../../../features/auth/hooks/useAuth";
import { apiFns, HeaderType } from "../../../ts/api-service";
import cookieHandler, { Token } from "../../../ts/cookie-handler";
import "./index.css";

export default function New() {
    const { user } = useAuth();

    async function onSubmitForm(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        const token: Token = cookieHandler.get("token");
        if (token) {
            const headers: HeaderType = { Authorization: `Token ${token}` };
            const formData: FormData = new FormData(e.currentTarget);
            formData.append("owner", (user?.id as number).toString());
            const response: Response = await apiFns.post("listings/new", formData, headers);
            const data = await response.json();
            console.log(data);
        }
    }

    return (
        <main id="new-listing-page">
            <h1>Create New Listing</h1>
            <form onSubmit={onSubmitForm}>
                <section>
                    <h2>Site Location</h2>
                    <InputWithLabel inputProps={{ name: "province" }}>Province</InputWithLabel>

                    <InputWithLabel inputProps={{ name: "city" }}>City</InputWithLabel>

                    <InputWithLabel inputProps={{ name: "baranggay" }}>Baranggay</InputWithLabel>

                    <InputWithLabel inputProps={{ name: "street" }}>Street</InputWithLabel>
                </section>
                <section>
                    <h2>Listing Details</h2>
                    <InputWithLabel inputProps={{ name: "title" }}>Title</InputWithLabel>
                    <SelectBasic
                        label="Listing Type"
                        selectProps={{ name: "listing_type" }}
                        labelProps={{ htmlFor: "listing_type" }}
                    >
                        <option value="FS">For Sale</option>
                        <option value="FR">For Rent</option>
                        <option value="FC">Foreclosure</option>
                    </SelectBasic>

                    <SelectBasic
                        label="Property Type"
                        selectProps={{ name: "property_type" }}
                        labelProps={{ htmlFor: "property_type" }}
                    >
                        <option value="HL">House and Lot</option>
                        <option value="RL">Residential Lot</option>
                        <option value="CL">Commercial Lot</option>
                        <option value="CO">Condominium</option>
                    </SelectBasic>

                    <InputWithLabel inputProps={{ name: "price", type: "number" }}>Price</InputWithLabel>
                </section>
                <section>
                    <h2>Upload Images</h2>
                    <InputWithLabel inputProps={{ name: "image", type: "file", accept: "image/png, image/jpeg" }}>
                        Image
                    </InputWithLabel>
                </section>
                <section>
                    <h2>Additional Info</h2>
                    <label htmlFor="description">Description</label>
                    <textarea name="description"></textarea>

                    <InputWithLabel inputProps={{ name: "property_size", type: "number" }}>
                        Property Size
                    </InputWithLabel>

                    <InputWithLabel inputProps={{ name: "bedrooms", type: "number" }}>No. of Bedrooms</InputWithLabel>

                    <InputWithLabel inputProps={{ name: "bathrooms", type: "number" }}>No. of Bathrooms</InputWithLabel>
                </section>
                <BtnBasic type="submit">Submit</BtnBasic>
            </form>
        </main>
    );
}
