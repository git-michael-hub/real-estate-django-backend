import { useContext } from "react";
import BuyerContext, { BuyerContextType } from "../context/BuyersProvider";

const useBuyer = (): BuyerContextType => {
    return useContext(BuyerContext);
};

export default useBuyer;
