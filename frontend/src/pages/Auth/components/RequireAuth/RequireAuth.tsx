import { Outlet, Navigate, useLocation } from "react-router-dom";
import useAuth from "../../../../features/auth/hooks/useAuth";

export type RolesType = string[];

type RequireAuthProps = {
    roles: RolesType;
};

export default function RequireAuth(props: RequireAuthProps) {
    const { user } = useAuth();
    const location = useLocation();

    const isAllowed = (userRoles: RolesType, allowedRoles: RolesType) => {
        if (!allowedRoles) return true;
        userRoles.some((role: string) => allowedRoles.includes(role));
    };

    return !user ? (
        <Navigate to="/login" state={{ from: location }} replace />
    ) : isAllowed(user.roles, props.roles) ? (
        <Outlet />
    ) : (
        <Navigate to="/unauthorized" state={{ from: location }} replace />
    );
}
