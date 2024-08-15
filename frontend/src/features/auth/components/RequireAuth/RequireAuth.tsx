import { Outlet, Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export type RolesType = {
    is_buyer?: boolean;
    is_seller?: boolean;
    is_agent?: boolean;
};

export default function RequireAuth(props: RolesType) {
    const { user } = useAuth();
    const location = useLocation();

    return user?.roles?.is_buyer === props.is_buyer ||
        user?.roles?.is_seller === props.is_seller ||
        user?.roles?.is_agent === props.is_agent ? (
        <Outlet />
    ) : user ? (
        <Navigate to="/unauthorized" state={{ from: location }} replace />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
}
