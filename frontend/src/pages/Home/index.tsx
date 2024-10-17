import ListingSearchFormH from "../../features/listings/components/ListingSearchFormH";
import "./index.css";

export default function Home() {
    return (
        <main id="home-page">
            <section id="search-form-section">
                <h2>Find the perfect place to Live with your family</h2>
                <ListingSearchFormH></ListingSearchFormH>
            </section>
            <div id="home-page-bg"></div>
        </main>
    );
}
