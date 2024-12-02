import { createContext, useState } from "react";

type ChildrenType = { children?: React.ReactElement | React.ReactElement[] };

export const ListingFormProvider = ({ children }: ChildrenType): React.ReactElement => {
    const [description, setDescription] = useState<string>("");
    const [listingType, setListingType] = useState<"FS" | "FR" | "FC">("FS");
    const [propertyType, setPropertyType] = useState<"HL" | "CO" | "RL" | "CL">("HL");
    const [price, setPrice] = useState<number | undefined>();
    const [propertySize, setPropertySize] = useState<number | undefined>();
    const [bedrooms, setBedrooms] = useState<number | undefined>();
    const [bathrooms, setBathrooms] = useState<number | undefined>();
    const [title, setTitle] = useState<string>("");
    const [street, setStreet] = useState<string>("");
    const [baranggay, setBaranggay] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [province, setProvince] = useState<string>("");
    const [image1, setImage1] = useState<File | null>(null);
    const [image2, setImage2] = useState<File | null>(null);
    const [image3, setImage3] = useState<File | null>(null);
    const [image4, setImage4] = useState<File | null>(null);
    const [image5, setImage5] = useState<File | null>(null);

    return (
        <ListingFormContext.Provider
            value={{
                description,
                setDescription,
                listingType,
                setListingType,
                propertyType,
                setPropertyType,
                price,
                setPrice,
                propertySize,
                setPropertySize,
                bedrooms,
                setBedrooms,
                bathrooms,
                setBathrooms,
                title,
                setTitle,
                street,
                setStreet,
                baranggay,
                setBaranggay,
                city,
                setCity,
                province,
                setProvince,
                image1,
                setImage1,
                image2,
                setImage2,
                image3,
                setImage3,
                image4,
                setImage4,
                image5,
                setImage5,
            }}
        >
            {children}
        </ListingFormContext.Provider>
    );
};

export type ListingFormContextType = {
    description: string;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    listingType: "FS" | "FR" | "FC";
    setListingType: React.Dispatch<React.SetStateAction<"FS" | "FR" | "FC">>;
    propertyType: "HL" | "CO" | "RL" | "CL";
    setPropertyType: React.Dispatch<React.SetStateAction<"HL" | "CO" | "RL" | "CL">>;
    price: number | undefined;
    setPrice: React.Dispatch<React.SetStateAction<number | undefined>>;
    propertySize: number | undefined;
    setPropertySize: React.Dispatch<React.SetStateAction<number | undefined>>;
    bedrooms: number | undefined;
    setBedrooms: React.Dispatch<React.SetStateAction<number | undefined>>;
    bathrooms: number | undefined;
    setBathrooms: React.Dispatch<React.SetStateAction<number | undefined>>;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    street: string;
    setStreet: React.Dispatch<React.SetStateAction<string>>;
    baranggay: string;
    setBaranggay: React.Dispatch<React.SetStateAction<string>>;
    city: string;
    setCity: React.Dispatch<React.SetStateAction<string>>;
    province: string;
    setProvince: React.Dispatch<React.SetStateAction<string>>;
    image1: File | null;
    setImage1: React.Dispatch<React.SetStateAction<File | null>>;
    image2: File | null;
    setImage2: React.Dispatch<React.SetStateAction<File | null>>;
    image3: File | null;
    setImage3: React.Dispatch<React.SetStateAction<File | null>>;
    image4: File | null;
    setImage4: React.Dispatch<React.SetStateAction<File | null>>;
    image5: File | null;
    setImage5: React.Dispatch<React.SetStateAction<File | null>>;
};

const initListingFormContextState: ListingFormContextType = {
    description: "",
    setDescription: () => Promise.resolve(""),
    listingType: "FS",
    setListingType: () => Promise.resolve("FS"),
    propertyType: "HL",
    setPropertyType: () => Promise.resolve("HL"),
    price: undefined,
    setPrice: () => Promise.resolve(),
    propertySize: undefined,
    setPropertySize: () => Promise.resolve(),
    bedrooms: undefined,
    setBedrooms: () => Promise.resolve(),
    bathrooms: undefined,
    setBathrooms: () => Promise.resolve(),
    title: "",
    setTitle: () => Promise.resolve(""),
    street: "",
    setStreet: () => Promise.resolve(""),
    baranggay: "",
    setBaranggay: () => Promise.resolve(""),
    city: "",
    setCity: () => Promise.resolve(""),
    province: "",
    setProvince: () => Promise.resolve(""),
    image1: null,
    setImage1: () => Promise.resolve(null),
    image2: null,
    setImage2: () => Promise.resolve(null),
    image3: null,
    setImage3: () => Promise.resolve(null),
    image4: null,
    setImage4: () => Promise.resolve(null),
    image5: null,
    setImage5: () => Promise.resolve(null),
};

const ListingFormContext = createContext<ListingFormContextType>(initListingFormContextState);

export default ListingFormContext;
