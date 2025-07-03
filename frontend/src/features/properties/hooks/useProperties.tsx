import { useContext } from "react";
import PropertyContext, { PropertyContextType } from "../context/PropertiesProvider";

const useProperty = (): PropertyContextType => {
    return useContext(PropertyContext);
};

export default useProperty;
