import React, { useState, useRef } from "react";  // ✅ added useRef
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import "../pageStyles/Contact.css";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";  // ✅ added emailjs import

const ContactUs = () => {
    const form = useRef();
    const [isSent, setIsSent] = useState(false);
    const [isSending, setIsSending] = useState(false);  // ✅ loading state

    const sendEmail = (e) => {
        e.preventDefault();
        setIsSending(true);  // ✅ disable button while sending

        emailjs.sendForm(
            "service_6lodd8b",
            "template_zv43grt",
            form.current,
            "dSScr0cUN2Kv0bq0p"
        )
            .then(() => {
                setIsSent(true);
                setIsSending(false);
                form.current.reset();

                toast.success('Message sent successfully!', {
                    position: 'top-right',
                    autoClose: 2000,
                    theme: 'dark'
                });
            })
            .catch((error) => {
                console.error(error);
                setIsSending(false);
                toast.error('Failed to send message. Please try again.', {
                    position: 'top-right',
                    autoClose: 2000,
                    theme: 'dark'
                });
            });
    }

    return (
        <>
            <PageTitle title="Contact Us" />
            <Navbar />

            <div className="contact-container">
                <h1>Contact Us</h1>

                {/* ✅ show success message after sending */}
                {isSent && (
                    <p className="contact-success">
                        ✅ Thanks for reaching out! We'll get back to you soon.
                    </p>
                )}

                {/* ✅ removed value & onChange — emailjs uses ref, not controlled inputs */}
                <form ref={form} onSubmit={sendEmail} className="contact-form">
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        required
                    />

                    <textarea
                        name="message"
                        placeholder="Your Message"
                        required
                    />

                    {/* ✅ disabled while sending */}
                    <button type="submit" disabled={isSending}>
                        {isSending ? "Sending..." : "Send Message"}
                    </button>
                </form>
            </div>

            <Footer />
        </>
    );
};

export default ContactUs;