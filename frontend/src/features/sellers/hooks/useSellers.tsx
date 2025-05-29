import { useContext } from "react";
import SellerContext, { SellerContextType } from "../context/SellersProvider";

const useSeller = (): SellerContextType => {
    return useContext(SellerContext);
};

export default useSeller;
