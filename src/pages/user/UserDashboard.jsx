import React, { useState, useEffect } from "react";

/**
 * Flow:
 * 1. User types a location -> we search verified shops whose saved
 *    address contains that text (data comes from OwnerDashboard's
 *    `shopVerificationRequests` list + live `shop_${email}` verified flag).
 * 2. User picks a shop -> we show that shop's products (from the shared
 *    "products" localStorage list, filtered by ownerEmail).
 * 3. User adds products to cart.
 * 4. User checks out -> picks Card or UPI -> places a (mock) order.
 *
 * This is a reference flow for ONE location/shop at a time. Once this
 * works end-to-end, the same pattern extends to many shops/locations
 * since everything is driven by the existing localStorage data.
 */

const UserDashboard = () => {
  const [view, setView] = useState("location"); // location | products | payment | success

  // ---- Location & shop search ----
  const [locationSearch, setLocationSearch] = useState("");
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);

  // ---- Products ----
  const [productSearch, setProductSearch] = useState("");
  const [shopProducts, setShopProducts] = useState([]);

  // ---- Cart ----
  const [cart, setCart] = useState([]);

  // ---- Payment ----
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = () => {
    const requests =
      JSON.parse(
        localStorage.getItem("shopVerificationRequests")
      ) || [];

    const verifiedShops = requests
      .map((r) => {
        const liveShop =
          JSON.parse(
            localStorage.getItem(`shop_${r.email}`)
          ) || {};

        return {
          email: r.email,
          ownerName: liveShop.name || r.name,
          phone: liveShop.phone || r.phone,
          shopName: liveShop.shopName || r.shopName,
          address: liveShop.address || r.address,
          verified:
            liveShop.verified !== undefined
              ? liveShop.verified
              : r.verified || false,
        };
      })
      .filter((s) => s.verified);

    setShops(verifiedShops);
  };

  const filteredShops = locationSearch.trim()
  ? shops.filter((s) => {
      const search = locationSearch.trim().toLowerCase();
      return (
        s.address.toLowerCase().includes(search) ||
        s.shopName.toLowerCase().includes(search)
      );
    })
  : [];

  const selectShop = (shop) => {
    setSelectedShop(shop);

    const allProducts =
      JSON.parse(localStorage.getItem("products")) || [];

    setShopProducts(
      allProducts.filter((p) => p.ownerEmail === shop.email)
    );

    setProductSearch("");
    setView("products");
  };

  const filteredProducts = shopProducts.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );

  const goToPayment = () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Add a product first.");
      return;
    }
    setView("payment");
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (paymentMethod === "card") {
      if (
        !cardDetails.number ||
        !cardDetails.name ||
        !cardDetails.expiry ||
        !cardDetails.cvv
      ) {
        alert("Please fill all card details.");
        return;
      }
    } else {
      if (!upiId) {
        alert("Please enter your UPI ID.");
        return;
      }
    }

    setOrderTotal(cartTotal);
    setView("success");
  };

  const startNewOrder = () => {
    setCart([]);
    setSelectedShop(null);
    setShopProducts([]);
    setLocationSearch("");
    setProductSearch("");
    setPaymentMethod("card");
    setCardDetails({ number: "", name: "", expiry: "", cvv: "" });
    setUpiId("");
    setView("location");
    loadShops();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🛍️ User Dashboard</h1>

      {/* ---------------- STEP 1: LOCATION -> SHOPS ---------------- */}
      {view === "location" && (
        <>
          <input
            placeholder="Enter your location (e.g. Vijayanagar)"
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            style={styles.search}
          />

          <h2 style={styles.sectionHeading}>
            {locationSearch
              ? `📍 Shops near "${locationSearch}"`
              : "📍 Search for a location"}
          </h2>

          <div style={styles.grid}>
            {filteredShops.length === 0 ? (
              <p style={styles.emptyText}>
                No verified shops found
                {locationSearch ? ` for "${locationSearch}"` : ""}.
                Try a different location, or check back once a shop
                owner has registered and been verified nearby.
              </p>
            ) : (
              filteredShops.map((shop) => (
                <div key={shop.email} style={styles.shopCard}>
                  <h3 style={styles.shopName}>🏪 {shop.shopName}</h3>
                  <p style={styles.shopDetail}>{shop.address}</p>
                  <p style={styles.shopDetail}>
                    👤 {shop.ownerName} &nbsp;|&nbsp; 📞 {shop.phone}
                  </p>
                  <button
                    style={styles.button}
                    onClick={() => selectShop(shop)}
                  >
                    View Shop →
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* ---------------- STEP 2: PRODUCTS ---------------- */}
      {view === "products" && selectedShop && (
        <>
          <button
            style={styles.backBtn}
            onClick={() => setView("location")}
          >
            ← Back to Shops
          </button>

          <div style={styles.shopHeaderCard}>
            <h2 style={styles.shopName}>🏪 {selectedShop.shopName}</h2>
            <p style={styles.shopDetail}>{selectedShop.address}</p>
          </div>

          <input
            placeholder="Search products..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            style={styles.search}
          />

          <div style={styles.grid}>
            {filteredProducts.length === 0 ? (
              <p style={styles.emptyText}>
                This shop hasn't added any matching products yet.
              </p>
            ) : (
              filteredProducts.map((p) => (
                <div key={p.id} style={styles.product}>
                  <img
                    src={
                      p.image ||
                      "https://via.placeholder.com/250"
                    }
                    alt={p.name}
                    style={styles.image}
                  />
                  <h3>{p.name}</h3>
                  <p style={styles.priceText}>₹{p.price}</p>
                  <p style={styles.shopDetail}>
                    Qty: {p.quantity}
                    {p.category ? ` • ${p.category}` : ""}
                  </p>
                  {p.description && (
                    <p style={styles.shopDetail}>{p.description}</p>
                  )}
                  <p style={styles.shopDetail}>
                    {p.delivery
                      ? "🚚 Delivery Available"
                      : "❌ No Delivery"}
                  </p>

                  <button
                    style={styles.button}
                    onClick={() => addToCart(p)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            )}
          </div>

          <div style={styles.card}>
            <h2>🛒 Cart ({cart.length})</h2>

            {cart.length === 0 ? (
              <p>No items added</p>
            ) : (
              <>
                {cart.map((item, i) => (
                  <div key={i} style={styles.cartRow}>
                    <span>
                      {item.name} - ₹{item.price}
                    </span>
                    <button
                      style={styles.removeBtn}
                      onClick={() => removeFromCart(i)}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <p style={styles.cartTotal}>
                  <strong>Total: ₹{cartTotal}</strong>
                </p>

                <button
                  style={styles.button}
                  onClick={goToPayment}
                >
                  Proceed to Payment →
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* ---------------- STEP 3: PAYMENT ---------------- */}
      {view === "payment" && (
        <>
          <button
            style={styles.backBtn}
            onClick={() => setView("products")}
          >
            ← Back to Products
          </button>

          <div style={styles.card}>
            <h2 style={styles.heading}>🧾 Order Summary</h2>

            {cart.map((item, i) => (
              <div key={i} style={styles.cartRow}>
                <span>{item.name}</span>
                <span>₹{item.price}</span>
              </div>
            ))}

            <p style={styles.cartTotal}>
              <strong>Total: ₹{cartTotal}</strong>
            </p>
          </div>

          <div style={styles.card}>
            <h2 style={styles.heading}>💳 Payment Method</h2>

            <div style={styles.toggleRow}>
              <button
                style={
                  paymentMethod === "card"
                    ? styles.toggleBtnActive
                    : styles.toggleBtn
                }
                onClick={() => setPaymentMethod("card")}
              >
                Card
              </button>
              <button
                style={
                  paymentMethod === "upi"
                    ? styles.toggleBtnActive
                    : styles.toggleBtn
                }
                onClick={() => setPaymentMethod("upi")}
              >
                UPI
              </button>
            </div>

            {paymentMethod === "card" ? (
              <>
                <input
                  type="text"
                  name="number"
                  placeholder="Card Number"
                  value={cardDetails.number}
                  onChange={handleCardChange}
                  style={styles.input}
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Name on Card"
                  value={cardDetails.name}
                  onChange={handleCardChange}
                  style={styles.input}
                />
                <div style={styles.toggleRow}>
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={handleCardChange}
                    style={{ ...styles.input, flex: 1 }}
                  />
                  <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={handleCardChange}
                    style={{ ...styles.input, flex: 1 }}
                  />
                </div>
              </>
            ) : (
              <input
                type="text"
                placeholder="Enter UPI ID (e.g. name@bank)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                style={styles.input}
              />
            )}

            <button style={styles.button} onClick={placeOrder}>
              Place Order ✅
            </button>
          </div>
        </>
      )}

      {/* ---------------- STEP 4: SUCCESS ---------------- */}
      {view === "success" && (
        <div style={styles.successCard}>
          <h2 style={styles.heading}>🎉 Order Placed Successfully!</h2>
          <p>Amount Paid: ₹{orderTotal}</p>
          <p style={styles.shopDetail}>
            Paid via {paymentMethod === "card" ? "Card" : "UPI"}
          </p>
          <button style={styles.button} onClick={startNewOrder}>
            Start New Order
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #43cea2, #185a9d)",
  },
  title: {
    textAlign: "center",
    color: "white",
    marginBottom: "20px",
  },
  sectionHeading: {
    color: "white",
    marginBottom: "15px",
  },
  heading: {
    marginBottom: "15px",
  },
  search: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "none",
    boxSizing: "border-box",
    fontSize: "16px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    boxSizing: "border-box",
    fontSize: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
  },
  product: {
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
  },
  shopCard: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
  },
  shopHeaderCard: {
    background: "white",
    padding: "18px 20px",
    borderRadius: "10px",
    marginBottom: "15px",
    boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
  },
  shopName: {
    margin: "0 0 8px 0",
    color: "#185a9d",
  },
  shopDetail: {
    color: "#555",
    margin: "4px 0",
    fontSize: "14px",
  },
  priceText: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  image: {
    width: "100%",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  button: {
    width: "100%",
    background: "#43cea2",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },
  backBtn: {
    background: "rgba(255,255,255,0.9)",
    color: "#185a9d",
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  removeBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "4px",
    width: "26px",
    height: "26px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  card: {
    marginTop: "20px",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
  },
  successCard: {
    marginTop: "60px",
    background: "white",
    padding: "40px",
    borderRadius: "15px",
    maxWidth: "450px",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
  },
  cartRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },
  cartTotal: {
    marginTop: "12px",
    fontSize: "18px",
  },
  emptyText: {
    color: "white",
    gridColumn: "1/-1",
    textAlign: "center",
  },
  toggleRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },
  toggleBtn: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "#f3f4f6",
    cursor: "pointer",
    fontWeight: "bold",
  },
  toggleBtnActive: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #43cea2",
    background: "#43cea2",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default UserDashboard;