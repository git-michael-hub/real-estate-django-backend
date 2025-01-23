import { useEffect } from "react";
import { apiFns } from "../../../ts/api-service";
import useAuth from "../../../features/auth/hooks/useAuth";
import { API_DIRECTORY_USERS } from "../../../features/auth/context/AuthProvider";

export default function UserList() {
    const { user } = useAuth();

    useEffect(() => {
        const fetchList = async () => {
            const response = await apiFns.get(`${API_DIRECTORY_USERS}?username=${user?.username}`);
            const data = response.data;
            console.log(data);
        };

        fetchList();
    });
    return <main>userlist</main>;
}
