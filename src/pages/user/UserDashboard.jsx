import React, { useState, useEffect } from "react";

const UPI_APPS = [
  { id: "phonepe", label: "PhonePe", emoji: "📱" },
  { id: "googlepay", label: "Google Pay", emoji: "🟢" },
  { id: "paytm", label: "Paytm", emoji: "🔵" },
  { id: "other", label: "Other UPI App", emoji: "💳" },
];

const UserDashboard = ({ onLogout }) => {
  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) || {};

  // ── NEW: which sidebar section is showing ──
  const [active, setActive] = useState("dashboard");

  // view now only controls the shop-browsing flow, nested under "Nearby Shops"
  const [view, setView] = useState("location"); // location | products | payment | success

  const [locationSearch, setLocationSearch] = useState("");
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);

  const [productSearch, setProductSearch] = useState("");
  const [shopProducts, setShopProducts] = useState([]);

  const [cart, setCart] = useState([]);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");
  const [upiApp, setUpiApp] = useState("phonepe");
  const [lastOrder, setLastOrder] = useState(null);
  const [orderTotal, setOrderTotal] = useState(0);

  // ── NEW: this buyer's own orders, for My Orders / Order History ──
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    loadShops();
    loadMyOrders();
  }, []);

  const loadShops = () => {
    const requests =
      JSON.parse(localStorage.getItem("shopVerificationRequests")) || [];

    const verifiedShops = requests
      .map((r) => {
        const liveShop =
          JSON.parse(localStorage.getItem(`shop_${r.email}`)) || {};

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

  // ── NEW: load orders placed by this buyer (used for My Orders / History) ──
  const loadMyOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setMyOrders(
      allOrders
        .filter((o) => o.buyerEmail === currentUser.email)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
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
    } else if (paymentMethod === "upi") {
      if (!upiId) {
        alert("Please enter your UPI ID.");
        return;
      }
    }

    const paymentLabel =
      paymentMethod === "cod"
        ? "Cash on Delivery"
        : paymentMethod === "card"
        ? "Card"
        : `${UPI_APPS.find((a) => a.id === upiApp)?.label || "UPI"} (UPI)`;

    const hasDelivery = cart.some((item) => item.delivery);

    const orderRecord = {
      id: Date.now(),
      ownerEmail: selectedShop.email,
      shopName: selectedShop.shopName,
      buyerEmail: currentUser.email || "",
      buyerName: currentUser.name || "Guest",
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        delivery: !!item.delivery,
      })),
      total: cartTotal,
      paymentMethod,
      paymentApp: paymentMethod === "upi" ? upiApp : null,
      paymentLabel,
      deliveryAvailable: hasDelivery,
      status: "Placed",
      createdAt: new Date().toISOString(),
    };

    const existingOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    localStorage.setItem(
      "orders",
      JSON.stringify([orderRecord, ...existingOrders])
    );

    const notification = {
      id: Date.now() + 1,
      ownerEmail: selectedShop.email,
      orderId: orderRecord.id,
      message: `🛒 New order from ${orderRecord.buyerName} — ₹${cartTotal} via ${paymentLabel}`,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const existingNotifications =
      JSON.parse(localStorage.getItem("notifications")) || [];

    localStorage.setItem(
      "notifications",
      JSON.stringify([notification, ...existingNotifications])
    );

    setOrderTotal(cartTotal);
    setLastOrder(orderRecord);
    setView("success");
    loadMyOrders(); // ── NEW: refresh My Orders / History right away
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
    setUpiApp("phonepe");
    setLastOrder(null);
    setView("location");
    loadShops();
  };

  const navItems = [
    { icon: "📊", label: "Dashboard", key: "dashboard" },
    { icon: "🧾", label: "My Orders", key: "myOrders" },
    { icon: "📜", label: "Order History", key: "orderHistory" },
    { icon: "🏪", label: "Nearby Shops", key: "nearbyShops" },
    { icon: "👤", label: "Profile", key: "profile" },
    { icon: "⚙️", label: "Settings", key: "settings" },
  ];

  const currentTab = navItems.find((n) => n.key === active) || navItems[0];

  // active (non-completed) orders vs history
  const activeOrders = myOrders.filter((o) => o.status !== "Delivered");
  const pastOrders = myOrders.filter((o) => o.status === "Delivered");

  return (
    <>
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:Inter,sans-serif;
        }
        .dash-layout{
          display:flex;
          min-height:100vh;
          background:#f1f5f9;
        }
        .dash-sidebar{
          width:280px;
          background:#111827;
          color:white;
          padding:30px;
          display:flex;
          flex-direction:column;
          justify-content:space-between;
        }
        .logo{
          font-size:32px;
          font-weight:800;
          margin-bottom:40px;
        }
        .logo span{ color:#10b981; }
        .sidebar-user{
          display:flex;
          gap:15px;
          align-items:center;
          background:#1f2937;
          padding:18px;
          border-radius:18px;
          margin-bottom:35px;
        }
        .avatar{
          width:60px;
          height:60px;
          border-radius:50%;
          background:linear-gradient(135deg,#43cea2,#185a9d);
          display:flex;
          justify-content:center;
          align-items:center;
          font-size:22px;
        }
        .sidebar-link{
          width:100%;
          padding:15px;
          border:none;
          border-radius:14px;
          background:none;
          color:white;
          text-align:left;
          margin-bottom:10px;
          cursor:pointer;
        }
        .sidebar-link.active{
          background:linear-gradient(135deg,#43cea2,#185a9d);
        }
        .logout-btn{
          background:#ef4444;
          color:white;
          border:none;
          padding:15px;
          border-radius:14px;
          cursor:pointer;
        }
        .dash-main{ flex:1; padding:35px; }
        .topbar{
          background:white;
          padding:30px;
          border-radius:20px;
          margin-bottom:30px;
        }
        .table-box{
          background:white;
          padding:30px;
          border-radius:20px;
        }
        .search{
          width:100%;
          padding:12px;
          margin-bottom:20px;
          border-radius:8px;
          border:1px solid #ddd;
          box-sizing:border-box;
          font-size:16px;
        }
        .input{
          width:100%;
          padding:12px;
          margin-bottom:12px;
          border-radius:8px;
          border:1px solid #ddd;
          box-sizing:border-box;
          font-size:16px;
        }
        .grid{
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
          gap:20px;
          margin-bottom:20px;
        }
        .product{
          background:white;
          padding:15px;
          border-radius:10px;
          text-align:center;
          box-shadow:0 5px 10px rgba(0,0,0,.08);
        }
        .shop-card{
          background:white;
          padding:20px;
          border-radius:10px;
          box-shadow:0 5px 10px rgba(0,0,0,.08);
        }
        .shop-header-card{
          background:white;
          padding:18px 20px;
          border-radius:10px;
          margin-bottom:15px;
          box-shadow:0 5px 10px rgba(0,0,0,.08);
        }
        .shop-name{ margin:0 0 8px 0; color:#185a9d; }
        .shop-detail{ color:#555; margin:4px 0; font-size:14px; }
        .price-text{ font-weight:bold; font-size:16px; }
        .image{
          width:100%;
          border-radius:10px;
          margin-bottom:10px;
        }
        .btn{
          width:100%;
          background:#43cea2;
          color:white;
          padding:12px;
          border:none;
          border-radius:6px;
          cursor:pointer;
          font-weight:bold;
          margin-top:10px;
        }
        .back-btn{
          background:#f3f4f6;
          color:#185a9d;
          padding:10px 16px;
          border:none;
          border-radius:6px;
          cursor:pointer;
          font-weight:bold;
          margin-bottom:15px;
        }
        .remove-btn{
          background:#ef4444;
          color:white;
          border:none;
          border-radius:4px;
          width:26px;
          height:26px;
          cursor:pointer;
          font-weight:bold;
        }
        .card{
          margin-top:20px;
          background:#fafafa;
          padding:20px;
          border-radius:10px;
        }
        .success-card{
          margin-top:30px;
          background:#f0fdf4;
          border:1px solid #bbf7d0;
          padding:40px;
          border-radius:15px;
          max-width:450px;
          margin-left:auto;
          margin-right:auto;
          text-align:center;
        }
        .success-msg{
          color:#16a34a;
          font-size:20px;
          font-weight:bold;
          margin-bottom:15px;
        }
        .cart-row{
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:8px 0;
          border-bottom:1px solid #eee;
        }
        .cart-total{ margin-top:12px; font-size:18px; }
        .empty-text{ color:#6b7280; grid-column:1/-1; text-align:center; }
        .toggle-row{ display:flex; gap:10px; margin-bottom:15px; }
        .toggle-btn{
          flex:1;
          padding:12px;
          border-radius:8px;
          border:1px solid #ddd;
          background:#f3f4f6;
          cursor:pointer;
          font-weight:bold;
        }
        .toggle-btn-active{
          flex:1;
          padding:12px;
          border-radius:8px;
          border:1px solid #43cea2;
          background:#43cea2;
          color:white;
          cursor:pointer;
          font-weight:bold;
        }
        .cod-note{
          background:#fef9c3;
          border:1px solid #fde68a;
          border-radius:8px;
          padding:14px;
          color:#854d0e;
          font-weight:600;
          text-align:center;
          margin-bottom:10px;
        }
        .upi-app-row{ display:flex; flex-wrap:wrap; gap:10px; margin-bottom:15px; }
        .upi-app-btn{
          flex:1 1 120px;
          padding:10px;
          border-radius:8px;
          border:1px solid #ddd;
          background:#f3f4f6;
          cursor:pointer;
          font-weight:bold;
        }
        .upi-app-btn-active{
          flex:1 1 120px;
          padding:10px;
          border-radius:8px;
          border:1px solid #185a9d;
          background:#185a9d;
          color:white;
          cursor:pointer;
          font-weight:bold;
        }
      `}</style>

      <div className="dash-layout">
        <aside className="dash-sidebar">
          <div>
            <div className="logo">
              Nearby<span>Hub</span>
            </div>

            <div className="sidebar-user">
              <div className="avatar">{currentUser.name?.charAt(0)}</div>
              <div>
                <h4>{currentUser.name}</h4>
                <p>Customer</p>
              </div>
            </div>

            {navItems.map((item) => (
              <button
                key={item.key}
                className={`sidebar-link ${
                  active === item.key ? "active" : ""
                }`}
                onClick={() => setActive(item.key)}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          <button className="logout-btn" onClick={() => onLogout?.()}>
            🚪 Logout
          </button>
        </aside>

        <div className="dash-main">
          <div className="topbar">
            <h1>
              {currentTab.icon} {currentTab.label}
            </h1>
            <p>Welcome back, {currentUser.name}</p>
          </div>

          {active === "dashboard" && (
            <div className="table-box">
              <h2>Overview</h2>
              <p style={{ marginTop: 12 }}>Total Orders: {myOrders.length}</p>
              <p>Active Orders: {activeOrders.length}</p>
              <p>Completed Orders: {pastOrders.length}</p>
            </div>
          )}

          {active === "myOrders" && (
            <div className="table-box">
              <h2>My Orders</h2>
              {activeOrders.length === 0 ? (
                <p>You have no active orders right now.</p>
              ) : (
                <div className="grid">
                  {activeOrders.map((order) => (
                    <div key={order.id} className="product">
                      <h3>{order.shopName}</h3>
                      <p><strong>Total: ₹{order.total}</strong></p>
                      <p><strong>Payment:</strong> {order.paymentLabel}</p>
                      <p><strong>Status:</strong> {order.status}</p>
                      <div style={{ textAlign: "left", marginTop: 10 }}>
                        {order.items.map((item, i) => (
                          <p key={i} style={{ fontSize: 14, margin: "2px 0" }}>
                            • {item.name} — ₹{item.price}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {active === "orderHistory" && (
            <div className="table-box">
              <h2>Order History</h2>
              {myOrders.length === 0 ? (
                <p>No orders placed yet.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: 12 }}>Shop</th>
                      <th style={{ textAlign: "left", padding: 12 }}>Total</th>
                      <th style={{ textAlign: "left", padding: 12 }}>Payment</th>
                      <th style={{ textAlign: "left", padding: 12 }}>Status</th>
                      <th style={{ textAlign: "left", padding: 12 }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myOrders.map((order) => (
                      <tr key={order.id}>
                        <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{order.shopName}</td>
                        <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>₹{order.total}</td>
                        <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{order.paymentLabel}</td>
                        <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{order.status}</td>
                        <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                          {new Date(order.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {active === "nearbyShops" && (
            <div className="table-box">
              {/* ---------------- STEP 1: LOCATION -> SHOPS ---------------- */}
              {view === "location" && (
                <>
                  <input
                    placeholder="Enter your location (e.g. Vijayanagar)"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="search"
                  />

                  <h2 style={{ marginBottom: 15 }}>
                    {locationSearch
                      ? `📍 Shops near "${locationSearch}"`
                      : "📍 Search for a location"}
                  </h2>

                  <div className="grid">
                    {filteredShops.length === 0 ? (
                      <p className="empty-text">
                        No verified shops found
                        {locationSearch ? ` for "${locationSearch}"` : ""}.
                        Try a different location, or check back once a shop
                        owner has registered and been verified nearby.
                      </p>
                    ) : (
                      filteredShops.map((shop) => (
                        <div key={shop.email} className="shop-card">
                          <h3 className="shop-name">🏪 {shop.shopName}</h3>
                          <p className="shop-detail">{shop.address}</p>
                          <p className="shop-detail">
                            👤 {shop.ownerName} &nbsp;|&nbsp; 📞 {shop.phone}
                          </p>
                          <button className="btn" onClick={() => selectShop(shop)}>
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
                  <button className="back-btn" onClick={() => setView("location")}>
                    ← Back to Shops
                  </button>

                  <div className="shop-header-card">
                    <h2 className="shop-name">🏪 {selectedShop.shopName}</h2>
                    <p className="shop-detail">{selectedShop.address}</p>
                  </div>

                  <input
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="search"
                  />

                  <div className="grid">
                    {filteredProducts.length === 0 ? (
                      <p className="empty-text">
                        This shop hasn't added any matching products yet.
                      </p>
                    ) : (
                      filteredProducts.map((p) => (
                        <div key={p.id} className="product">
                          <img
                            src={p.image || "https://via.placeholder.com/250"}
                            alt={p.name}
                            className="image"
                          />
                          <h3>{p.name}</h3>
                          <p className="price-text">₹{p.price}</p>
                          <p className="shop-detail">
                            Qty: {p.quantity}
                            {p.category ? ` • ${p.category}` : ""}
                          </p>
                          {p.description && (
                            <p className="shop-detail">{p.description}</p>
                          )}
                          <p className="shop-detail">
                            {p.delivery ? "🚚 Delivery Available" : "❌ No Delivery"}
                          </p>
                          <button className="btn" onClick={() => addToCart(p)}>
                            Add to Cart
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="card">
                    <h2>🛒 Cart ({cart.length})</h2>
                    {cart.length === 0 ? (
                      <p>No items added</p>
                    ) : (
                      <>
                        {cart.map((item, i) => (
                          <div key={i} className="cart-row">
                            <span>
                              {item.name} - ₹{item.price}
                            </span>
                            <button className="remove-btn" onClick={() => removeFromCart(i)}>
                              ✕
                            </button>
                          </div>
                        ))}
                        <p className="cart-total"><strong>Total: ₹{cartTotal}</strong></p>
                        <button className="btn" onClick={goToPayment}>
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
                  <button className="back-btn" onClick={() => setView("products")}>
                    ← Back to Products
                  </button>

                  <div className="card">
                    <h2>🧾 Order Summary</h2>
                    {cart.map((item, i) => (
                      <div key={i} className="cart-row">
                        <span>{item.name}</span>
                        <span>₹{item.price}</span>
                      </div>
                    ))}
                    <p className="cart-total"><strong>Total: ₹{cartTotal}</strong></p>
                  </div>

                  <div className="card">
                    <h2>💳 Payment Method</h2>

                    <div className="toggle-row">
                      <button
                        className={paymentMethod === "cod" ? "toggle-btn-active" : "toggle-btn"}
                        onClick={() => setPaymentMethod("cod")}
                      >
                        Cash on Delivery
                      </button>
                      <button
                        className={paymentMethod === "card" ? "toggle-btn-active" : "toggle-btn"}
                        onClick={() => setPaymentMethod("card")}
                      >
                        Card
                      </button>
                      <button
                        className={paymentMethod === "upi" ? "toggle-btn-active" : "toggle-btn"}
                        onClick={() => setPaymentMethod("upi")}
                      >
                        UPI
                      </button>
                    </div>

                    {paymentMethod === "cod" && (
                      <p className="cod-note">
                        💵 Pay with cash when your order arrives (or when you pick
                        it up). No payment details needed right now.
                      </p>
                    )}

                    {paymentMethod === "card" && (
                      <>
                        <input
                          type="text"
                          name="number"
                          placeholder="Card Number"
                          value={cardDetails.number}
                          onChange={handleCardChange}
                          className="input"
                        />
                        <input
                          type="text"
                          name="name"
                          placeholder="Name on Card"
                          value={cardDetails.name}
                          onChange={handleCardChange}
                          className="input"
                        />
                        <div className="toggle-row">
                          <input
                            type="text"
                            name="expiry"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={handleCardChange}
                            className="input"
                            style={{ flex: 1 }}
                          />
                          <input
                            type="text"
                            name="cvv"
                            placeholder="CVV"
                            value={cardDetails.cvv}
                            onChange={handleCardChange}
                            className="input"
                            style={{ flex: 1 }}
                          />
                        </div>
                      </>
                    )}

                    {paymentMethod === "upi" && (
                      <>
                        <div className="upi-app-row">
                          {UPI_APPS.map((app) => (
                            <button
                              key={app.id}
                              className={upiApp === app.id ? "upi-app-btn-active" : "upi-app-btn"}
                              onClick={() => setUpiApp(app.id)}
                            >
                              {app.emoji} {app.label}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder={`Enter your ${
                            UPI_APPS.find((a) => a.id === upiApp)?.label || "UPI"
                          } ID (e.g. name@bank)`}
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="input"
                        />
                      </>
                    )}

                    <button className="btn" onClick={placeOrder}>
                      Place Order ✅
                    </button>
                  </div>
                </>
              )}

              {/* ---------------- STEP 4: SUCCESS ---------------- */}
              {view === "success" && (
                <div className="success-card">
                  {/* ── NEW: required success message, shown immediately ── */}
                  <p className="success-msg">
                    ✅ Your order has been placed successfully!
                  </p>
                  <h2 style={{ marginBottom: 15 }}>Order Confirmed</h2>
                  <p>Amount Paid: ₹{orderTotal}</p>
                  <p className="shop-detail">
                    Paid via {lastOrder?.paymentLabel || "—"}
                  </p>
                  <p className="shop-detail">
                    {lastOrder?.deliveryAvailable
                      ? "🚚 Delivery available for this order"
                      : "🏃 Pickup only — no delivery for this order"}
                  </p>
                  <p className="shop-detail">
                    The shop has been notified of your order and will get back
                    to you shortly.
                  </p>
                  <button className="btn" onClick={startNewOrder}>
                    Start New Order
                  </button>
                </div>
              )}
            </div>
          )}

          {active === "profile" && (
            <div className="table-box">
              <h2>Profile</h2>
              <p style={{ marginTop: 12 }}><strong>Name:</strong> {currentUser.name}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Role:</strong> Customer</p>
            </div>
          )}

          {active === "settings" && (
            <div className="table-box">
              <h2>Settings</h2>
              <p style={{ marginTop: 12 }}>Email Notifications: ON</p>
              <p>Order Updates: ON</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;