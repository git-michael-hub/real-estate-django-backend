import { useContext } from "react";
import UserContext, { UseUserContextType } from "../context/UserProvider";

const useUser = (): UseUserContextType => {
    return useContext(UserContext);
};

export default useUser;
