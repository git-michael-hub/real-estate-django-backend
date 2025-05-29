import { useEffect, useState } from "react";
import { apiFns, APIResponseType, HeaderType } from "../../../utils/api-service";
import { SellerAccountType } from "../../../types/types";
import {} from "../../../features/sellers/context/SellersProvider";
import "./index.css";
import { Link } from "react-router-dom";
import BtnBasicActive from "../../../components/Buttons/BtnBasicActive";
import { API_URLS } from "../../../urls/api-urls";
import cookieHandler, { Token } from "../../../utils/cookie-handler";

export default function List() {
    const [sellers, setSellers] = useState<SellerAccountType[]>([]);

    useEffect(() => {
        const fetchSellers = async () => {
            const token: Token = cookieHandler.get("token");
            const headers: HeaderType = { Authorization: `Token ${token}` };
            const response: APIResponseType = await apiFns.get(API_URLS.SELLER.LIST(), headers);
            const sellers: SellerAccountType[] = response.data;
            console.log(sellers);
            setSellers(sellers);
        };

        fetchSellers();
    }, []);

    return (
        <main id="sellers-page">
            <ul id="sellers-list-grid-container">
                <h2>Agents</h2>

                {sellers.map((seller) => {
                    return (
                        <li key={seller.user.id} className="seller-card-container">
                            <Link to={`@${seller.user.username}`}>
                                <img src={seller.profile_image_path} alt="" />
                            </Link>
                            <div>
                                <h3>
                                    <Link to={`@${seller.user.username}`}>
                                        {seller.user.first_name} {seller.user.last_name}
                                    </Link>
                                </h3>
                                <span>
                                    <em>@{seller.user.username}</em>
                                </span>
                                {seller.contact_number_1 ? (
                                    <span>
                                        <i className="fa-solid fa-phone"></i> {seller.contact_number_1}
                                    </span>
                                ) : (
                                    <></>
                                )}
                                {seller.contact_number_2 ? (
                                    <span>
                                        <i className="fa-solid fa-phone"></i> {seller.contact_number_2}
                                    </span>
                                ) : (
                                    <></>
                                )}
                                <span>
                                    <i className="fa-solid fa-envelope"></i> {seller.user.email}
                                </span>
                            </div>
                            <Link to={`@${seller.user.username}`}>
                                <BtnBasicActive>Details</BtnBasicActive>
                            </Link>
                        </li>
                    );
                })}
                {/* {sellers.map((seller) => {
                    return (
                        <li key={seller.id} className="seller-card-container">
                            <img src={seller.seller_image_url} alt="" />
                            <div>
                                <h3>
                                    <Link to={""}>
                                        {seller.first_name} {seller.last_name}
                                    </Link>
                                </h3>
                                <span>
                                    <em>@{seller.username}</em>
                                </span>
                                <span>
                                    <i className="fa-solid fa-phone"></i> {seller.contact_number_1}
                                </span>
                                {seller.contact_number_2 ? (
                                    <span>
                                        <i className="fa-solid fa-phone"></i> {seller.contact_number_2}
                                    </span>
                                ) : (
                                    <></>
                                )}
                                <span>
                                    <i className="fa-solid fa-envelope"></i> {seller.email}
                                </span>
                            </div>
                            <BtnBasicActive>Details</BtnBasicActive>
                        </li>
                    );
                })} */}
            </ul>
        </main>
    );
}
