import { useEffect } from "react";
import useAuth from "../../../features/auth/hooks/useAuth";
import { API_URLS } from "../../../urls/api-urls";
import { apiFns } from "../../../utils/api-service";

export default function UserList() {
    const { user } = useAuth();

    useEffect(() => {
        const fetchList = async () => {
            const response = await apiFns.get(`${API_URLS.AUTH.USER()}?username=${user?.username}`);
            const data = response.data;
            console.log(data);
        };

        fetchList();
    });
    return <main>userlist</main>;
}
