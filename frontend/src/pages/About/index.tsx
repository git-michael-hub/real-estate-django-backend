import "./index.css";

export default function About() {
    return (
        <main id="about-page">
            <section className="group-1 header">
                <div>
                    <h2>About Us</h2>
                    <p>
                        Welcome to <strong className="resystems">RE Systems</strong> where your dream home becomes a
                        reality.
                    </p>
                </div>
            </section>
            <section className="group-2 mission">
                <div>
                    <div className="img-container">
                        <img
                            src="/static/images/campaign-creators-unsplash.jpg"
                            alt="Photo by Campaign Creators on https://unsplash.com/photos/man-standing-in-front-of-people-sitting-beside-table-with-laptop-computers-gMsnXqILjp4?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
                        />
                    </div>
                    <div>
                        <h3>Our Mission</h3>
                        <p>
                            At <strong className="resystems">RE Systems</strong>, our mission is simple: to provide
                            unparalleled real estate services that empower our clients to make informed decisions with
                            confidence. We strive to exceed expectations through personalized service, expert market
                            knowledge, and a commitment to integrity and transparency.
                        </p>
                    </div>
                </div>
            </section>
            <section className="group-1">
                <div>
                    <h3>Who We Are</h3>
                    <p>
                        Founded on the principles of trust and excellence, our team brings together years of experience
                        in the real estate industry. Our agents are passionate, knowledgeable, and driven to guide you
                        through every step of the buying, selling, or leasing process. We believe that every client
                        deserves a customized experience tailored to their unique needs.
                    </p>
                </div>
            </section>
            <section className="group-2 services">
                <div>
                    <h3>Our Services</h3>
                    <ul>
                        <li>
                            Buying & Selling: Whether you're searching for your dream home or ready to sell your
                            property, our experts are here to ensure a smooth, stress-free transaction.
                        </li>
                        <li>
                            Leasing: From residential to commercial properties, we offer a wide range of leasing options
                            to match your requirements.
                        </li>
                        <li>
                            Investment Consulting: Our team provides comprehensive market analysis and investment
                            strategies to help you make sound real estate investments.
                        </li>
                    </ul>
                </div>
            </section>
            <section className="group-1">
                <div>
                    <h3>Our Commitment</h3>
                    <p>
                        We understand that real estate decisions are significant, and we're here to support you every
                        step of the way. Our commitment to excellence is reflected in every interaction, ensuring that
                        your experience with us is both rewarding and enjoyable. With{" "}
                        <strong className="resystems">RE Systems</strong>, you are not just a client – you become part
                        of our community.
                    </p>
                </div>
            </section>
            <section className="group-2">
                <div>
                    <h3>Join Our Community</h3>
                    <p>
                        Ready to start your real estate journey? Explore our listings, learn more about our services, or
                        get in touch with our team today. Let us help you find the place you'll proudly call home.
                    </p>
                </div>
            </section>
        </main>
    );
}
