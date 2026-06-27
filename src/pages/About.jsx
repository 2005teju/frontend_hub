import React, { useState } from "react";


const NearbyHubAbout = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const categories = [
    { name: "Groceries", img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1400&q=90", desc: "Nearby Hub partners with your neighborhood grocery stores like 'Fresh Basket' to bring daily essentials straight to your door. From staple grains, pulses, and spices to packaged foods and beverages — every product is sourced fresh, priced fairly, and delivered within the hour.", badge: "0 Products", sub: "Everyday Staples" },
    { name: "Fruits & Vegetables", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&q=90", desc: "Green Valley and similar local sabzi vendors on Nearby Hub restock every morning with seasonal, farm-fresh produce. Whether it's crisp leafy greens, exotic tropical fruits, or root vegetables — you get them at their nutritional peak, delivered before the day begins.", badge: "0 Varieties", sub: "Farm to Doorstep" },
    { name: "Bakery Items", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1400&q=90", desc: "Bake Bliss and local bakeries on Nearby Hub offer oven-fresh breads, puffs, cookies, and celebration cakes — baked in small batches with real ingredients. Order a custom birthday cake, a dozen dinner rolls, or your morning toast. Everything is ready the same day.", badge: "Fresh Daily", sub: "Local Bakers" },
    { name: "Medicines", img: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1400&q=90", desc: "MediCare and certified local pharmacies on Nearby Hub handle prescription uploads, OTC medicines, vitamins, and first-aid supplies responsibly. Our licensed partners ensure safe storage and accurate dispensing — so you get the right medicine, fast, without stepping out when you're unwell.", badge: "Licensed Pharmacies", sub: "Health & Wellness" },
    { name: "Stationery", img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1400&q=90", desc: "Write Way and nearby book depots on Nearby Hub stock everything from school supplies and exam pads to premium pens, art materials, and office essentials. Perfect for students, professionals, and creators alike. Order a single notebook or a bulk stationery kit — same neighborhood, same-day delivery.", badge: "0 Items", sub: "School & Office" },
    { name: "Clothing", img: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1400&q=90", desc: "Style Point and local boutiques on Nearby Hub carry a curated mix of everyday wear, ethnic fashion, and trending styles — all stitched or sourced locally. Discover handloom kurtas, casual tees, festive lehengas, and more. Support local designers and get clothes that fit the Indian lifestyle.", badge: "0 Boutiques", sub: "Local Fashion" },
    { name: "Footwear", img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1400&q=90", desc: "Sole Mate and local shoe stores on Nearby Hub carry footwear for every occasion — sports shoes, office formals, festive juttis, school shoes, and casual sandals. Available in all sizes for men, women, and children. Try before you buy with our hassle-free return policy.", badge: "All Sizes", sub: "Walk in Style" },
    { name: "Electronic Accessories", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400&q=90", desc: "Tech Connect and local electronics shops on Nearby Hub offer chargers, data cables, earphones, power banks, phone cases, and more — genuine accessories at honest prices. Expert staff will guide you to the right product for your device, unlike confusing online listings.", badge: "Genuine Products", sub: "Gadgets & Gear" },
    { name: "Household Items", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=90", desc: "Home Needs and local hardware stores on Nearby Hub stock everything your home requires — kitchen tools, cleaning supplies, storage solutions, bulbs, plumbing bits, and utility items. Stop making multiple trips to the bazaar; one order covers your entire monthly household list.", badge: "Everyday Needs", sub: "Home Essentials" },
    { name: "Handmade Products", img: "https://images.unsplash.com/photo-1464500422302-6188776dcbf7?w=1400&q=90", desc: "Craft Corner and local artisan collectives on Nearby Hub bring you one-of-a-kind handcrafted goods — pottery, macramé, hand-painted diyas, fabric art, and eco-friendly gifts. Each piece is made by a real person in your neighborhood. Buy unique, buy local, buy with heart.", badge: "Artisan Crafted", sub: "Made with Love" },
  ];

  const nextSlide = () => setActiveSlide((prev) => (prev === categories.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setActiveSlide((prev) => (prev === 0 ? categories.length - 1 : prev - 1));

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap');
        * { box-sizing: border-box; scroll-behavior: smooth; }
        .feature-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
        .nav-btn:hover { background: #FFB800 !important; color: #000 !important; transform: scale(1.1); }
        .thumb-btn:hover { border-color: #FFB800 !important; transform: scale(1.05); }
      `}</style>

      {/* HERO */}
      <header style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.brandBadge}>VIRTUAL INDIAN MARKETPLACE</div>
          <h1 style={styles.heroTitle}>About Nearby Hub</h1>
          <p style={styles.heroSubtitle}>
            We are the digital pulse of your neighborhood. Connecting local trust with modern technology
            to bring the <b>entire high street</b> to your doorstep in minutes.
          </p>
          <div style={styles.heroStats}>
            <div><b>0</b><br /><small>Core Hubs</small></div>
            <div style={styles.divider}></div>
            <div><b>Instant</b><br /><small>Connectivity</small></div>
            <div style={styles.divider}></div>
            <div><b>Purely</b><br /><small>Local</small></div>
          </div>
        </div>
      </header>

      {/* MISSION */}
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.missionGrid}>
            <div style={styles.missionText}>
              <h2 style={styles.sectionHeading}>Empowering the Local Street</h2>
              <p style={styles.paragraph}>
                <b>Nearby Hub</b> is a mission-driven platform designed to protect and promote local Indian businesses.
                We believe the heart of every community lives in the small shops and stalls that have served families for generations —
                the sabziwala who knows your preferences, the medical store you've trusted for years, the baker who crafts your festival sweets by hand.
                Nearby Hub brings all of them onto one platform, so you can discover and order from the shops already around you.
              </p>
              <p style={styles.paragraph}>
                Our platform gives these vendors a digital presence overnight — without complexity or cost. Customers get access to everything from
                <b> Medicines</b> to <b>Handmade Crafts</b> without losing the warmth and personal trust of local commerce.
                No big warehouse, no unknown seller — just your own neighborhood, now online.
              </p>
              <div style={styles.missionHighlights}>
                {[
                  ["🏪", "0 Local Shops", "Verified & trusted partners"],
                  ["⚡", "0 Min Delivery", "Average across all categories"],
                  ["💚", "₹0 Platform Fee", "Free for local vendors to join"],
                ].map(([icon, title, sub], i) => (
                  <div key={i} style={styles.highlightCard}>
                    <div style={styles.highlightIcon}>{icon}</div>
                    <div>
                      <b style={{ fontSize: "1rem", color: "#0F172A" }}>{title}</b>
                      <br />
                      <span style={{ fontSize: "0.8rem", color: "#64748B" }}>{sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.missionImage}>
              <img
                src="/products.png.jpeg"
                alt="Nearby Hub Products"
                style={styles.roundedImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SLIDER */}
      <section style={styles.sliderSection}>
        <h2 style={styles.sliderHeading}>Our Marketplace Categories</h2>
        <p style={styles.sliderSubhead}>0 hyperlocal hubs — every daily need covered by shops just around the corner.</p>

        <div style={styles.sliderWrapper}>
          <button onClick={prevSlide} className="nav-btn" style={styles.navBtn}>&#10094;</button>

          <div style={styles.sliderWindow}>
            <div
              style={{
                ...styles.sliderTrack,
                transform: `translateX(-${activeSlide * 100}%)`,
              }}
            >
              {categories.map((cat, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.slide,
                    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.88) 38%, rgba(0,0,0,0.30) 70%, transparent), url(${cat.img})`,
                  }}
                >
                  <div style={styles.slideInfo}>
                    <span style={styles.slideCounter}>Category {index + 1} of 0</span>
                    <div style={styles.slideBadge}>{cat.sub}</div>
                    <h3 style={styles.slideTitle}>{cat.name}</h3>
                    <p style={styles.slideDesc}>{cat.desc}</p>
                    <div style={styles.slideStat}>
                      <span style={styles.slideStatDot}>◆</span> {cat.badge}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={nextSlide} className="nav-btn" style={{ ...styles.navBtn, right: "-28px", left: "auto" }}>&#10095;</button>
        </div>

        {/* Thumbnail row */}
        <div style={styles.thumbRow}>
          {categories.map((cat, i) => (
            <button
              key={i}
              className="thumb-btn"
              onClick={() => setActiveSlide(i)}
              style={{
                ...styles.thumbBtn,
                border: activeSlide === i ? "2px solid #FFB800" : "2px solid transparent",
                opacity: activeSlide === i ? 1 : 0.6,
              }}
            >
              <img src={cat.img} alt={cat.name} style={styles.thumbImg} />
              <div style={styles.thumbLabel}>{cat.name}</div>
            </button>
          ))}
        </div>

        <div style={styles.dotContainer}>
          {categories.map((_, i) => (
            <div
              key={i}
              onClick={() => setActiveSlide(i)}
              style={{
                ...styles.dot,
                width: activeSlide === i ? "30px" : "8px",
                background: activeSlide === i ? "#FFB800" : "#CBD5E1",
              }}
            />
          ))}
        </div>
      </section>

      {/* HUB ADVANTAGE */}
      <section style={{ ...styles.section, backgroundColor: "#F8FAFC" }}>
        <div style={styles.container}>
          <h2 style={{ ...styles.sectionHeading, textAlign: "center", marginBottom: "16px" }}>The Hub Advantage</h2>
          <p style={{ ...styles.paragraph, textAlign: "center", maxWidth: "560px", margin: "0 auto 60px" }}>
            Nearby Hub isn't just another delivery app. It's a community infrastructure built specifically for India's neighborhood commerce.
          </p>
          <div style={styles.featureGrid}>
            {[
              { title: "Daily Use Focus", desc: "Optimized for everyday Indian household needs — from atta and dal to school supplies and medicines. We stock what real families actually need, not just trending items.", icon: "🏠" },
              { title: "Artisan Support", desc: "Direct access to handmade and unique products from local creators. Every purchase keeps a craft alive and puts money directly into a local artisan's hands.", icon: "🏺" },
              { title: "Zero Travel", desc: "Get products from your local street delivered while you stay home. No traffic, no parking, no standing in queues — just doorstep convenience in 0 minutes or less.", icon: "🚲" },
              { title: "Personal Trust", desc: "Every vendor on Nearby Hub is verified and from your locality. You know these shop owners — now they're just a tap away, with the same quality you've trusted for years.", icon: "🤝" },
              { title: "Support the Economy", desc: "When you shop on Nearby Hub, 0% of the order value goes to a local business owner, not a distant warehouse. It's hyperlocal commerce that strengthens your own neighborhood.", icon: "💚" },
              { title: "Always Expanding", desc: "We're adding new vendor categories, cities, and features continuously. From laundry to tiffin services — Nearby Hub is growing to cover every neighborhood need.", icon: "🚀" },
            ].map((f, i) => (
              <div key={i} className="feature-card" style={styles.featureCard}>
                <div style={styles.featureIcon}>{f.icon}</div>
                <h4 style={styles.featureTitle}>{f.title}</h4>
                <p style={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <h2 style={styles.footerTitle}>Building a stronger neighborhood together.</h2>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "50px", fontSize: "1.05rem", maxWidth: "500px", margin: "0 auto 50px", lineHeight: "1.7" }}>
          Join 0 shoppers and 0 local vendors already part of the Nearby Hub community across India.
        </p>
        <button style={styles.ctaButton}>Explore Nearby Hub</button>
      </footer>
    </div>
  );
};

const styles = {
  page: { fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1E293B", backgroundColor: "#fff", overflowX: "hidden" },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "0 20px" },

  hero: {
    height: "85vh",
    // Changed: vibrant Indian street market / local shop hero
    background: "linear-gradient(rgba(15,23,42,0.65), rgba(15,23,42,0.65)), url('https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1600&q=90')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#fff",
  },
  heroContent: { maxWidth: "900px" },
  brandBadge: { display: "inline-block", background: "#FFB800", color: "#000", padding: "8px 20px", borderRadius: "50px", fontSize: "0.8rem", fontWeight: "800", marginBottom: "25px", letterSpacing: "1px" },
  heroTitle: { fontSize: "5rem", fontWeight: "800", margin: "0", lineHeight: "1.1", letterSpacing: "-2px" },
  heroSubtitle: { fontSize: "1.3rem", opacity: "0.9", marginTop: "30px", lineHeight: "1.7", fontWeight: "300" },
  heroStats: { display: "flex", justifyContent: "center", gap: "50px", marginTop: "50px" },
  divider: { width: "1px", height: "50px", background: "rgba(255,255,255,0.2)" },

  section: { padding: "120px 0" },
  missionGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" },
  missionText: {},
  sectionHeading: { fontSize: "3rem", fontWeight: "800", marginBottom: "30px", color: "#0F172A", letterSpacing: "-1px" },
  paragraph: { fontSize: "1.1rem", lineHeight: "1.85", color: "#475569", marginBottom: "25px" },
  missionHighlights: { display: "flex", flexDirection: "column", gap: "16px", marginTop: "32px" },
  highlightCard: { display: "flex", alignItems: "center", gap: "16px", background: "#F8FAFC", borderRadius: "16px", padding: "16px 20px", border: "1px solid #E2E8F0" },
  highlightIcon: { fontSize: "1.8rem", minWidth: "36px", textAlign: "center" },
  missionImage: { textAlign: "right" },
  roundedImg: { width: "100%", borderRadius: "60px", boxShadow: "0 40px 80px rgba(0,0,0,0.12)" },

  sliderSection: { padding: "100px 5%", backgroundColor: "#fff" },
  sliderHeading: { textAlign: "center", fontSize: "2.5rem", fontWeight: "800", marginBottom: "12px" },
  sliderSubhead: { textAlign: "center", color: "#64748B", fontSize: "1.05rem", marginBottom: "50px" },
  sliderWrapper: { position: "relative", display: "flex", alignItems: "center", maxWidth: "1300px", margin: "0 auto" },
  sliderWindow: { width: "100%", height: "560px", borderRadius: "40px", overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,0.15)" },
  sliderTrack: { display: "flex", transition: "transform 0.8s cubic-bezier(0.7, 0, 0.3, 1)", height: "100%" },
  slide: { minWidth: "100%", backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "center", padding: "0 10%" },
  slideInfo: { color: "#fff", maxWidth: "560px" },
  slideCounter: { color: "#FFB800", fontWeight: "800", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" },
  slideBadge: { display: "inline-block", background: "rgba(255,184,0,0.2)", border: "1px solid rgba(255,184,0,0.5)", color: "#FFB800", padding: "4px 14px", borderRadius: "30px", fontSize: "0.78rem", fontWeight: "600", marginTop: "10px", marginBottom: "4px" },
  slideTitle: { fontSize: "3.2rem", fontWeight: "800", margin: "10px 0 18px", letterSpacing: "-1px", lineHeight: "1.1" },
  slideDesc: { fontSize: "1.05rem", opacity: 0.88, lineHeight: "1.75", marginBottom: "20px" },
  slideStat: { display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", fontWeight: "700", color: "#FFB800" },
  slideStatDot: { fontSize: "0.6rem" },

  navBtn: { position: "absolute", left: "-28px", zIndex: 10, background: "#fff", border: "none", width: "56px", height: "56px", borderRadius: "50%", cursor: "pointer", boxShadow: "0 10px 30px rgba(0,0,0,0.12)", fontSize: "1.4rem", transition: "0.3s" },

  thumbRow: { display: "flex", gap: "10px", justifyContent: "center", maxWidth: "1300px", margin: "32px auto 0", flexWrap: "wrap" },
  thumbBtn: { background: "none", padding: 0, cursor: "pointer", borderRadius: "12px", overflow: "hidden", transition: "all 0.3s", width: "108px" },
  thumbImg: { width: "100%", height: "68px", objectFit: "cover", display: "block" },
  thumbLabel: { background: "#0F172A", color: "#fff", fontSize: "0.65rem", fontWeight: "600", padding: "5px 4px", textAlign: "center", lineHeight: "1.2" },

  dotContainer: { display: "flex", justifyContent: "center", gap: "10px", marginTop: "28px" },
  dot: { height: "8px", borderRadius: "10px", transition: "0.4s", cursor: "pointer" },

  featureGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" },
  featureCard: { background: "#fff", padding: "48px 36px", borderRadius: "32px", textAlign: "center", transition: "0.3s", border: "1px solid #E2E8F0" },
  featureIcon: { fontSize: "3rem", marginBottom: "20px" },
  featureTitle: { fontSize: "1.4rem", fontWeight: "800", marginBottom: "14px", color: "#0F172A" },
  featureDesc: { color: "#64748B", lineHeight: "1.75", fontSize: "0.98rem", margin: 0 },

  footer: { padding: "120px 20px", textAlign: "center", background: "#0F172A", color: "#fff" },
  footerTitle: { fontSize: "2.8rem", fontWeight: "800", marginBottom: "24px", maxWidth: "700px", margin: "0 auto 24px", lineHeight: "1.2" },
  ctaButton: { background: "#FFB800", color: "#000", border: "none", padding: "20px 56px", borderRadius: "60px", fontSize: "1.1rem", fontWeight: "800", cursor: "pointer", transition: "0.3s" },
};

export default NearbyHubAbout;