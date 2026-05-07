import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import "../pageStyles/About.css";

const AboutUs = () => {
    return (
        <>
            <PageTitle title="About Us" />
            <Navbar />

            <div className="about-container">
                <h1>About ECart</h1>

                <p>
                    Welcome to <strong>ECart</strong>, your one-stop destination for
                    quality products at the best prices.
                </p>

                <p>
                    We aim to provide a seamless shopping experience with fast delivery,
                    secure payments, and top-notch customer service.
                </p>

                <h2>Our Mission</h2>
                <p>
                    To make online shopping easy, affordable, and accessible for everyone.
                </p>

                <h2>Why Choose Us?</h2>
                <ul>
                    <li>Wide range of products</li>
                    <li>Secure payment system</li>
                    <li>Fast delivery</li>
                    <li>Easy returns</li>
                </ul>
            </div>

            <Footer />
        </>
    );
};

export default AboutUs;