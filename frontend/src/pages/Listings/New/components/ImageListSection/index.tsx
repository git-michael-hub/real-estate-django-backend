import BtnImageUpload from "../../../../../components/Buttons/BtnImageUpload";
import { ListingType } from "../../../../../features/listings/context/ListingsProvider";

type ImageListSectionProps = {
    listing: ListingType | Partial<ListingType> | null;
    setListing: React.Dispatch<React.SetStateAction<ListingType | Partial<ListingType> | null>>;
};

export default function ImageListSection({ listing, setListing }: ImageListSectionProps) {
    return (
        <section className="listing-image-list">
            <div>
                <BtnImageUpload
                    imageFile={listing?.image1}
                    inputProps={{
                        onChange: (e) => (e.target.files ? setListing({ ...listing, image1: e.target.files[0] }) : {}),
                    }}
                    buttonProps={{ onClick: () => setListing({ ...listing, image1: null }) }}
                ></BtnImageUpload>
                <BtnImageUpload
                    imageFile={listing?.image2}
                    inputProps={{
                        onChange: (e) => (e.target.files ? setListing({ ...listing, image2: e.target.files[0] }) : {}),
                    }}
                    buttonProps={{ onClick: () => setListing({ ...listing, image2: null }) }}
                ></BtnImageUpload>
                <BtnImageUpload
                    imageFile={listing?.image3}
                    inputProps={{
                        onChange: (e) => (e.target.files ? setListing({ ...listing, image3: e.target.files[0] }) : {}),
                    }}
                    buttonProps={{ onClick: () => setListing({ ...listing, image3: null }) }}
                ></BtnImageUpload>
                <BtnImageUpload
                    imageFile={listing?.image4}
                    inputProps={{
                        onChange: (e) => (e.target.files ? setListing({ ...listing, image4: e.target.files[0] }) : {}),
                    }}
                    buttonProps={{ onClick: () => setListing({ ...listing, image4: null }) }}
                ></BtnImageUpload>
                <BtnImageUpload
                    imageFile={listing?.image5}
                    inputProps={{
                        onChange: (e) => (e.target.files ? setListing({ ...listing, image5: e.target.files[0] }) : {}),
                    }}
                    buttonProps={{ onClick: () => setListing({ ...listing, image5: null }) }}
                ></BtnImageUpload>
            </div>
        </section>
    );
}
