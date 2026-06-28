import React from 'react';

const Home = () => {
    return (
        <div className="nh-premium-body">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

                .nh-premium-body {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #d1c3c3;
                    color: #0f172a;
                    overflow-x: hidden;
                }

                /* --- BRIGHT INTEGRATED HERO SECTION --- */
                .nh-banner {
                    position: relative;
                    height: 520px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    color: white;
                    background: 
                        linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)),
                        url('/hero.webp'); 
                    background-size: cover;
                    background-position: center;
                    box-shadow: inset 0 0 100px rgba(0,0,0,0.2);
                }

                .nh-banner-content h1 {
                    font-size: 85px;
                    font-weight: 800;
                    margin: 0;
                    letter-spacing: -3px;
                    text-shadow: 0 10px 30px rgba(0,0,0,0.3);
                }

                .nh-banner-content p {
                    font-size: 24px;
                    margin: 15px 0 35px;
                    font-weight: 600;
                    color: #fde68a;
                }

                .nh-tagline {
                    background: #f59e0b;
                    color: #000;
                    padding: 6px 20px;
                    border-radius: 50px;
                    font-size: 14px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-bottom: 25px;
                    display: inline-block;
                }

                .btn-nh-amber {
                    background-color: #f59e0b;
                    color: white;
                    padding: 18px 45px;
                    border-radius: 12px;
                    font-size: 18px;
                    font-weight: 800;
                    border: none;
                    cursor: pointer;
                    transition: 0.4s;
                    box-shadow: 0 15px 30px rgba(245, 158, 11, 0.4);
                }

                .btn-nh-amber:hover {
                    transform: translateY(-5px);
                    background-color: #ffffff;
                    color: #f59e0b;
                }

                /* --- 6 FEATURES SECTION --- */
                .section-header {
                    text-align: center;
                    padding: 80px 0 20px;
                }

                .section-header h2 {
                    font-size: 42px;
                    font-weight: 800;
                    color: #0f172a;
                    margin-bottom: 10px;
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 30px;
                    padding: 40px 8% 100px;
                }

                .f-card {
                    background: #fff;
                    padding: 45px 35px;
                    border-radius: 30px;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.04);
                    transition: 0.4s;
                    position: relative;
                    overflow: hidden;
                }

                .f-card:hover {
                    transform: translateY(-12px);
                    border-color: #f59e0b;
                    box-shadow: 0 30px 60px rgba(245, 158, 11, 0.15);
                }

                .f-icon-box {
                    width: 70px;
                    height: 70px;
                    background: #fffbeb;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 25px;
                }

                .user-type {
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 8px;
                    display: block;
                }

                .f-card.customer .user-type { color: #f59e0b; }
                .f-card.owner .user-type { color: #0f172a; }

                .f-card h3 {
                    font-size: 22px;
                    font-weight: 800;
                    margin-bottom: 15px;
                    color: #1e293b;
                }

                .f-card p {
                    font-size: 15px;
                    color: #64748b;
                    line-height: 1.7;
                    margin: 0;
                }

                @media (max-width: 768px) {
                    .nh-banner-content h1 { font-size: 45px; }
                    .features-grid { padding: 30px 5%; }
                    .nh-banner { height: 450px; }
                }
            `}</style>

            {/* HIGH VIBRANCY BANNER */}
            <section className="nh-banner">
                <div className="nh-banner-content">
                    <div className="nh-tagline">Shop Local • Support Local</div>
                    <h1>Nearby Hub</h1>
                    <p>Everything your neighborhood has to offer, in one click.</p>
                    <button className="btn-nh-amber">Explore Marketplace</button>
                </div>
            </section>

            {/* SECTION HEADER */}
            <div className="section-header">
                <h2>Empowering Our Community</h2>
            </div>

            {/* 6 FEATURES GRID */}
            <div className="features-grid">
                
                {/* 1. Customer: Smart Discovery */}
                <div className="f-card customer">
                    <span className="user-type">For Customers</span>
                    <div className="f-icon-box">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <h3>Smart Item Search</h3>
                    <p>Quickly find groceries, bakery items, or stationery available at shops just a few blocks away.</p>
                </div>

                {/* 2. Customer: Deal Comparison */}
                <div className="f-card customer">
                    <span className="user-type">For Customers</span>
                    <div className="f-icon-box">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    </div>
                    <h3>Price Comparison</h3>
                    <p>Compare prices for electronic accessories and household items between multiple local vendors.</p>
                </div>

                {/* 3. Customer: Shop Navigation */}
                <div className="f-card customer">
                    <span className="user-type">For Customers</span>
                    <div className="f-icon-box">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    </div>
                    <h3>Live Store Mapping</h3>
                    <p>Get instant directions to the nearest pharmacy, clothing store, or handmade craft studio.</p>
                </div>

                {/* 4. Owner: Store Setup */}
                <div className="f-card owner">
                    <span className="user-type">For Shop Owners</span>
                    <div className="f-icon-box">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                    </div>
                    <h3>Digital Storefront</h3>
                    <p>Bring your physical shop online. Showcase your fruits, vegetables, and footwear to locals.</p>
                </div>

                {/* 5. Owner: Inventory Control */}
                <div className="f-card owner">
                    <span className="user-type">For Shop Owners</span>
                    <div className="f-icon-box">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
                    </div>
                    <h3>Stock Management</h3>
                    <p>Update stock for medicines or electronics in real-time so your customers never miss out.</p>
                </div>

                {/* 6. Owner: Market Insights */}
                <div className="f-card owner">
                    <span className="user-type">For Shop Owners</span>
                    <div className="f-icon-box">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                    </div>
                    <h3>Growth Analytics</h3>
                    <p>Understand which local products are trending and what your community needs most.</p>
                </div>

            </div>
        </div>
    );
};

export default Home;