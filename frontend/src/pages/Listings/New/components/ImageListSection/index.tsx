import BtnImageUpload from "../../../../../components/Buttons/BtnImageUpload";
import Message from "../../../../../components/Message";
import { ListingFormMessageStateType, ListingType } from "../../../../../features/listings/context/ListingsProvider";
import "./index.css";

type ImageListSectionProps = {
    listing: ListingType | Partial<ListingType> | null;
    setListing: React.Dispatch<React.SetStateAction<ListingType | Partial<ListingType> | null>>;
    formMessages: ListingFormMessageStateType;
};

export default function ImageListSection({ listing, setListing, formMessages }: ImageListSectionProps) {
    return (
        <section className="listing-image-list">
            <div>
                <div>
                    <BtnImageUpload
                        imageFile={listing?.image1}
                        inputProps={{
                            onChange: (e) =>
                                e.target.files ? setListing({ ...listing, image1: e.target.files[0] }) : {},
                        }}
                        buttonProps={{ onClick: () => setListing({ ...listing, image1: null }) }}
                    ></BtnImageUpload>
                    {formMessages.image1 ? <Message type="error">{formMessages.image1[0]}</Message> : <></>}
                </div>
                <div>
                    <BtnImageUpload
                        imageFile={listing?.image2}
                        inputProps={{
                            onChange: (e) =>
                                e.target.files ? setListing({ ...listing, image2: e.target.files[0] }) : {},
                        }}
                        buttonProps={{ onClick: () => setListing({ ...listing, image2: null }) }}
                    ></BtnImageUpload>
                    {formMessages.image2 ? <Message type="error">{formMessages.image2[0]}</Message> : <></>}
                </div>
                <div>
                    <BtnImageUpload
                        imageFile={listing?.image3}
                        inputProps={{
                            onChange: (e) =>
                                e.target.files ? setListing({ ...listing, image3: e.target.files[0] }) : {},
                        }}
                        buttonProps={{ onClick: () => setListing({ ...listing, image3: null }) }}
                    ></BtnImageUpload>
                    {formMessages.image3 ? <Message type="error">{formMessages.image3[0]}</Message> : <></>}
                </div>
                <div>
                    <BtnImageUpload
                        imageFile={listing?.image4}
                        inputProps={{
                            onChange: (e) =>
                                e.target.files ? setListing({ ...listing, image4: e.target.files[0] }) : {},
                        }}
                        buttonProps={{ onClick: () => setListing({ ...listing, image4: null }) }}
                    ></BtnImageUpload>
                    {formMessages.image4 ? <Message type="error">{formMessages.image4[0]}</Message> : <></>}
                </div>
                <div>
                    <BtnImageUpload
                        imageFile={listing?.image5}
                        inputProps={{
                            onChange: (e) =>
                                e.target.files ? setListing({ ...listing, image5: e.target.files[0] }) : {},
                        }}
                        buttonProps={{ onClick: () => setListing({ ...listing, image5: null }) }}
                    ></BtnImageUpload>
                    {formMessages.image5 ? <Message type="error">{formMessages.image5[0]}</Message> : <></>}
                </div>
            </div>
        </section>
    );
}
