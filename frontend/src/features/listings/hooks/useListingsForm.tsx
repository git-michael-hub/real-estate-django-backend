import { useContext } from "react";
import ListingFormContext, { ListingFormContextType } from "../context/ListingsFormProvider";

const useListingForm = (): ListingFormContextType => {
    return useContext(ListingFormContext);
};

export default useListingForm;
