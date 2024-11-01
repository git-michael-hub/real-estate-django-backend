import { useEffect, useState } from "react";
import { apiFns, APIResponseType } from "../../../ts/api-service";
import { SellerType } from "../../../features/sellers/context/SellersProvider";
import "./index.css";
import { Link } from "react-router-dom";
import BtnBasic from "../../../components/Buttons/BtnBasic";

export default function List() {
    const [sellers, setSellers] = useState<SellerType[]>([]);

    useEffect(() => {
        const fetchSellers = async () => {
            const response: APIResponseType = await apiFns.get("sellers/");
            const sellers: SellerType[] = response.data;
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
                        <li key={seller.id} className="seller-card-container">
                            <Link to={`@${seller.username}`}>
                                <img src={seller.seller_image_url} alt="" />
                            </Link>
                            <div>
                                <h3>
                                    <Link to={`@${seller.username}`}>
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
                            <Link to={`@${seller.username}`}>
                                <BtnBasic>Details</BtnBasic>
                            </Link>
                        </li>
                    );
                })}
                {sellers.map((seller) => {
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
                            <BtnBasic>Details</BtnBasic>
                        </li>
                    );
                })}
            </ul>
        </main>
    );
}
