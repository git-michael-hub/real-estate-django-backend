import { useContext } from "react";
import ListingContext, { ListingContextType } from "../context/ListingsProvider";

const useListing = (): ListingContextType => {
    return useContext(ListingContext);
};

export default useListing;
