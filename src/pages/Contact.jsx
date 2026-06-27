import React, { useState } from "react";

const Contact = () => {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) return;

        setIsLoading(true);
        setStatus("");

        setTimeout(() => {
            const newMessage = {
                id: Date.now(),
                ...form,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                sentAt: new Date().toISOString(), // ── NEW: added for admin dashboard timestamp
                status: "Unread"
            };

            const existingMessages = JSON.parse(localStorage.getItem("messages") || "[]");
            localStorage.setItem("messages", JSON.stringify([newMessage, ...existingMessages]));

            // ── NEW: also save to contactMessages so admin dashboard can read it ──
            const existingContactMessages = JSON.parse(localStorage.getItem("contactMessages") || "[]");
            localStorage.setItem("contactMessages", JSON.stringify([newMessage, ...existingContactMessages]));
            // ─────────────────────────────────────────────────────────────────────

            setIsLoading(false);
            setStatus("✨ Your message has been sent to the Hub. We'll be in touch soon!");
            setForm({ name: "", email: "", message: "" });
        }, 1500);
    };

    return (
        <div className="contact-page-wrapper">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                .contact-page-wrapper {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f8fafc;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    padding: 20px;
                }

                .contact-glass-hub {
                    display: flex;
                    width: 1150px;
                    height: 750px;
                    background: #ffffff;
                    border-radius: 40px;
                    box-shadow: 0 40px 100px rgba(15, 23, 42, 0.08);
                    overflow: hidden;
                    border: 1px solid #f1f5f9;
                }

                /* Left Side: Visual & Info */
                .visual-section {
                    flex: 1.25;
                    background: linear-gradient(rgba(15, 23, 42, 0.3), rgba(15, 23, 42, 0.8)), 
                                url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070&auto=format&fit=crop');
                    background-size: cover;
                    background-position: center;
                    padding: 60px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    color: white;
                }

                .visual-overlay-content h1 {
                    font-size: 56px;
                    font-weight: 800;
                    letter-spacing: -2px;
                    margin-bottom: 20px;
                    line-height: 1.1;
                }

                .visual-overlay-content p {
                    font-size: 19px;
                    opacity: 0.9;
                    line-height: 1.6;
                    max-width: 420px;
                }

                /* Glass Info Piles */
                .hub-contact-info {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .info-item {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(12px);
                    padding: 16px 24px;
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    width: fit-content;
                    transition: all 0.3s ease;
                }
                .info-item:hover { background: rgba(255, 255, 255, 0.2); transform: translateX(10px); }
                .info-item span { font-size: 20px; }
                .info-item p { margin: 0; font-weight: 600; font-size: 15px; }

                /* Right Side: Simple Form */
                .form-section {
                    flex: 1;
                    padding: 50px 70px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .form-header-box { margin-bottom: 40px; }
                .form-header-box h2 { font-size: 34px; color: #0f172a; font-weight: 800; letter-spacing: -1px; }
                .form-header-box p { color: #64748b; font-size: 16px; margin-top: 5px; }

                .input-container { margin-bottom: 24px; }
                .input-container label { display: block; font-size: 12px; font-weight: 800; color: #1e293b; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1.2px; }
                
                .input-field {
                    width: 100%;
                    padding: 18px 22px;
                    background: #f8fafc;
                    border: 2px solid #f1f5f9;
                    border-radius: 18px;
                    font-size: 15px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    outline: none;
                    box-sizing: border-box;
                    color: #0f172a;
                }

                .input-field:focus {
                    border-color: #6366f1;
                    background: #ffffff;
                    box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.1);
                }

                .submit-trigger {
                    width: 100%;
                    padding: 18px;
                    background: #0f172a;
                    color: white;
                    border: none;
                    border-radius: 18px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin-top: 10px;
                    box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.2);
                }

                .submit-trigger:hover {
                    background: #6366f1;
                    transform: translateY(-2px);
                    box-shadow: 0 20px 30px -5px rgba(99, 102, 241, 0.2);
                }

                .submit-trigger:disabled { opacity: 0.6; cursor: wait; }

                @media (max-width: 1100px) {
                    .contact-glass-hub { width: 100%; height: auto; flex-direction: column; border-radius: 24px; }
                    .visual-section { height: 450px; padding: 40px; }
                    .form-section { padding: 40px 30px; }
                }
            `}</style>

            <div className="contact-glass-hub">
                {/* Visual Section with Contact Details */}
                <div className="visual-section">
                    <div className="visual-overlay-content">
                        <h1>Nearby Hub</h1>
                        <p>Connecting local businesses with the community through modern technology.</p>
                    </div>

                    <div className="hub-contact-info">
                        <div className="info-item">
                            <span>📧</span>
                            <p>hello@nearbyhub.com</p>
                        </div>
                        <div className="info-item">
                            <span>📞</span>
                            <p>+91 98765 43210</p>
                        </div>
                        <div className="info-item">
                            <span>🌐</span>
                            <p>www.nearbyhub.com</p>
                        </div>
                    </div>
                </div>

                {/* Simplified Contact Form */}
                <div className="form-section">
                    <div className="form-header-box">
                        <h2>Let's Build Something Together</h2>
                        <p>Share your ideas — we'll take it from there.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="input-container">
                            <label>Your Name</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="What should we call you?"
                                className="input-field"
                                required
                            />
                        </div>

                        <div className="input-container">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Where can we reach you?"
                                className="input-field"
                                required
                            />
                        </div>

                        <div className="input-container">
                            <label>Your Message</label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                placeholder="Tell us what you're thinking..."
                                className="input-field"
                                rows="4"
                                style={{ resize: 'none' }}
                                required
                            />
                        </div>

                        <button type="submit" className="submit-trigger" disabled={isLoading}>
                            {isLoading ? "Sending..." : "Submit Message →"}
                        </button>

                        {status && (
                            <div style={{ marginTop: '20px', textAlign: 'center', color: '#16a34a', fontWeight: '700', fontSize: '14px' }}>
                                {status}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;