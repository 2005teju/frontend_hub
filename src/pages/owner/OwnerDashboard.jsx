import React, { useState, useEffect } from "react";
import api from "../../api";

const CATEGORY_OPTIONS = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Grains & Pulses",
  "Bakery",
  "Snacks",
  "Beverages",
  "Personal Care",
  "Household",
  "Others",
];

const OwnerDashboard = ({ onLogout }) => {
  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) || {};

  const [approved, setApproved] = useState(false);
  const [active, setActive] = useState("dashboard");

  const [owner, setOwner] = useState({
    name: currentUser.name || "",
    phone: "",
    shopName: "",
    address: "",
    gstId: "",
    customerLicense: "",
    verified: false,
  });

  const [products, setProducts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [shopOrders, setShopOrders] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    image: "",
    description: "",
    delivery: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Approval status comes straight from the database (User.approved)
      const me = await api.getMe();
      setApproved(me.user.approved || false);

      // Shop details from the database
      const shopRes = await api.getMyShop();
      if (shopRes.shop) {
        setOwner({
          name: shopRes.shop.name || currentUser.name || "",
          phone: shopRes.shop.phone || "",
          shopName: shopRes.shop.shopName || "",
          address: shopRes.shop.address || "",
          gstId: shopRes.shop.gstId || "",
          customerLicense: shopRes.shop.customerLicense || "",
          verified: shopRes.shop.verified || false,
        });
      }

      // Products from the database (only this owner's own products)
      if (shopRes.shop && shopRes.shop.verified) {
        const myProducts = await api.getMyProducts();
        setProducts(myProducts);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Failed to load owner data:", err.message);
    }

    // NOTE: the backend does not yet have endpoints for "orders received by
    // shop" or "owner notifications" (only a per-user order history exists).
    // Until that's added on the backend, these two stay on localStorage so
    // the UI doesn't break - everything else above is now real database data.
    const allNotifications =
      JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(
      allNotifications
        .filter((n) => n.ownerEmail === currentUser.email)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );

    const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setShopOrders(
      allOrders
        .filter((o) => o.ownerEmail === currentUser.email)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  };

  const markNotificationRead = (id) => {
    const allNotifications =
      JSON.parse(localStorage.getItem("notifications")) || [];
    const updated = allNotifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    localStorage.setItem("notifications", JSON.stringify(updated));
    setNotifications(
      updated
        .filter((n) => n.ownerEmail === currentUser.email)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setOwner((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveShopDetails = async () => {
    const shopData = {
      name: owner.name.trim(),
      phone: owner.phone.trim(),
      shopName: owner.shopName.trim(),
      address: owner.address.trim(),
      gstId: owner.gstId.trim(),
      customerLicense: owner.customerLicense.trim(),
    };

    if (
      !shopData.name ||
      !shopData.phone ||
      !shopData.shopName ||
      !shopData.address ||
      !shopData.gstId ||
      !shopData.customerLicense
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      // Saves the shop in MongoDB and submits it for admin verification
      const res = await api.saveShop(shopData);
      setOwner({ ...shopData, verified: res.shop.verified });
      alert(res.message || "Shop details saved successfully waiting for admin verification.");
    } catch (err) {
      alert(err.message || "Failed to save shop details.");
    }
  };

  const addProduct = async () => {
    if (!form.name || !form.price || !form.quantity || !form.category) {
      alert("Please enter product name, price, quantity and category.");
      return;
    }

    try {
      // Saves the product in MongoDB
      const res = await api.addProduct(form);
      setProducts((prev) => [...prev, res.product]);

      setForm({
        name: "",
        price: "",
        quantity: "",
        category: "",
        image: "",
        description: "",
        delivery: false,
      });

      alert(res.message || "Product Added Successfully.");
    } catch (err) {
      alert(err.message || "Failed to add product.");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete product.");
    }
  };

  const navItems = [
    { icon: "📊", label: "Dashboard", key: "dashboard" },
    { icon: "🏪", label: "Shop Details", key: "shopDetails" },
    { icon: "🛒", label: "My Products", key: "myProducts" },
    { icon: "➕", label: "Add Product", key: "addProduct" },
    { icon: "📦", label: "Orders Received", key: "orders" },
    { icon: "🧾", label: "Order History", key: "orderHistory" },
    { icon: "👤", label: "Profile", key: "profile" },
    { icon: "⚙️", label: "Settings", key: "settings" },
  ];

  const currentTab = navItems.find((n) => n.key === active) || navItems[0];

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
          background:linear-gradient(135deg,#6366f1,#10b981);
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
          background:linear-gradient(135deg,#6366f1,#10b981);
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
        .input{
          width:100%;
          padding:12px;
          margin-bottom:15px;
          border-radius:8px;
          border:1px solid #ddd;
          font-size:16px;
        }
        .textarea{
          width:100%;
          padding:12px;
          margin-bottom:15px;
          border-radius:8px;
          border:1px solid #ddd;
          min-height:100px;
          font-size:16px;
        }
        .checkbox{
          display:flex;
          align-items:center;
          gap:10px;
          margin-bottom:20px;
          font-size:16px;
        }
        .btn{
          width:100%;
          background:#2563eb;
          color:#fff;
          border:none;
          padding:14px;
          border-radius:8px;
          cursor:pointer;
          font-weight:bold;
          font-size:16px;
        }
        .verified-summary{
          background:#f0fdf4;
          border:1px solid #bbf7d0;
          border-radius:10px;
          padding:18px 20px;
          margin-bottom:10px;
          line-height:1.7;
        }
        .pending-box{
          background:#fff5f5;
          border:1px solid #fecaca;
          padding:30px;
          border-radius:15px;
          text-align:center;
        }
        .grid{
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
          gap:20px;
          margin-top:20px;
        }
        .product-card{
          background:#fff;
          border:1px solid #eee;
          border-radius:15px;
          padding:20px;
          text-align:center;
          box-shadow:0 6px 15px rgba(0,0,0,.08);
        }
        .product-card img{
          width:100%;
          height:180px;
          object-fit:cover;
          border-radius:10px;
          margin-bottom:15px;
        }
        .delete-btn{
          background:#ef4444;
          color:#fff;
          border:none;
          padding:10px 15px;
          border-radius:8px;
          margin-top:15px;
          cursor:pointer;
          font-weight:bold;
        }
        .notification-row{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:10px;
          padding:12px 0;
          border-bottom:1px solid #eee;
        }
        .notification-row.unread{
          background:#eff6ff;
          border-radius:8px;
          padding:12px;
        }
        .mark-read-btn{
          background:#2563eb;
          color:#fff;
          border:none;
          padding:8px 12px;
          border-radius:6px;
          cursor:pointer;
          font-weight:bold;
          font-size:13px;
          white-space:nowrap;
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
                <p>Shop Owner</p>
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

          {!approved ? (
            <div className="pending-box">
              <h2>⏳ Waiting for Admin Approval</h2>
              <p>
                Your account has been created. Please wait until the admin
                approves your request.
              </p>
            </div>
          ) : (
            <>
              {active === "dashboard" && (
                <div className="table-box">
                  <h2>Overview</h2>
                  <p style={{ marginTop: 12 }}>
                    Shop: {owner.shopName || "Not set up yet"}
                  </p>
                  <p>Status: {owner.verified ? "✅ Verified" : "⏳ Pending Verification"}</p>
                  <p>Total Products: {products.length}</p>
                  <p>Orders Received: {shopOrders.length}</p>
                  <p>Unread Notifications: {unreadNotificationCount}</p>
                </div>
              )}

              {active === "shopDetails" && (
                <div className="table-box">
                  {!owner.verified ? (
                    <>
                      <input
                        type="text"
                        name="name"
                        placeholder="Owner Name"
                        value={owner.name || ""}
                        onChange={handleOwnerChange}
                        className="input"
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={owner.phone || ""}
                        onChange={handleOwnerChange}
                        className="input"
                      />
                      <input
                        type="text"
                        name="shopName"
                        placeholder="Shop Name"
                        value={owner.shopName || ""}
                        onChange={handleOwnerChange}
                        className="input"
                      />
                      <input
                        type="text"
                        name="address"
                        placeholder="Shop Address"
                        value={owner.address || ""}
                        onChange={handleOwnerChange}
                        className="input"
                      />
                      <input
                        type="text"
                        name="gstId"
                        placeholder="GST ID"
                        value={owner.gstId || ""}
                        onChange={handleOwnerChange}
                        className="input"
                      />
                      <input
                        type="text"
                        name="customerLicense"
                        placeholder="Customer License Number"
                        value={owner.customerLicense || ""}
                        onChange={handleOwnerChange}
                        className="input"
                      />
                      <button className="btn" onClick={saveShopDetails}>
                        Submit for Verification
                      </button>
                      {owner.shopName && (
                        <p
                          style={{
                            color: "#dc2626",
                            textAlign: "center",
                            marginTop: 15,
                            fontWeight: "bold",
                          }}
                        >
                          ⏳ Waiting for Admin Verification. Products can be
                          added only after approval.
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="verified-summary">
                      <p><strong>Owner Name:</strong> {owner.name}</p>
                      <p><strong>Phone:</strong> {owner.phone}</p>
                      <p><strong>Shop Name:</strong> {owner.shopName}</p>
                      <p><strong>Address:</strong> {owner.address}</p>
                      <p><strong>GST ID:</strong> {owner.gstId}</p>
                      <p><strong>Customer License:</strong> {owner.customerLicense}</p>
                      <p style={{ color: "#16a34a", fontWeight: "bold", marginTop: 10 }}>
                        ✅ Your shop has been verified by the admin.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {active === "myProducts" && (
                <div className="table-box">
                  <h2>My Products</h2>
                  {!owner.verified ? (
                    <p>Your shop must be verified before products can be shown here.</p>
                  ) : (
                    <div className="grid">
                      {products.length === 0 ? (
                        <p>No products added yet.</p>
                      ) : (
                        products.map((p) => (
                          <div key={p._id} className="product-card">
                            <img
                              src={p.image || "https://via.placeholder.com/250"}
                              alt={p.name}
                            />
                            <h3>{p.name}</h3>
                            <p><strong>₹{p.price}</strong></p>
                            <p><strong>Quantity:</strong> {p.quantity}</p>
                            <p><strong>Category:</strong> {p.category}</p>
                            <p>{p.description}</p>
                            <p>
                              {p.delivery
                                ? "🚚 Delivery Available"
                                : "❌ No Delivery"}
                            </p>
                            <p><strong>Quality:</strong> {p.quality}</p>
                            <button
                              className="delete-btn"
                              onClick={() => deleteProduct(p._id)}
                            >
                              Delete Product
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {active === "addProduct" && (
                <div className="table-box">
                  <h2>Add Product</h2>
                  {!owner.verified ? (
                    <p>Your shop must be verified before you can add products.</p>
                  ) : (
                    <>
                      <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={form.name}
                        onChange={handleChange}
                        className="input"
                      />
                      <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={form.price}
                        onChange={handleChange}
                        className="input"
                      />
                      <input
                        type="text"
                        name="quantity"
                        placeholder="Quantity (e.g. 1 Kg, 2 Liters)"
                        value={form.quantity}
                        onChange={handleChange}
                        className="input"
                      />
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="input"
                      >
                        <option value="">Select Category</option>
                        {CATEGORY_OPTIONS.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        name="image"
                        placeholder="Image URL"
                        value={form.image}
                        onChange={handleChange}
                        className="input"
                      />
                      <textarea
                        name="description"
                        placeholder="Product Description"
                        value={form.description}
                        onChange={handleChange}
                        className="textarea"
                      />
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          name="delivery"
                          checked={form.delivery}
                          onChange={handleChange}
                        />
                        Delivery Available
                      </label>
                      <button className="btn" onClick={addProduct}>
                        Add Product
                      </button>
                    </>
                  )}
                </div>
              )}

              {active === "orders" && (
                <div className="table-box">
                  <h2>
                    📦 Order Notifications
                    {unreadNotificationCount > 0
                      ? ` (${unreadNotificationCount} new)`
                      : ""}
                  </h2>

                  {notifications.length === 0 ? (
                    <p>No notifications yet.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`notification-row ${
                          n.read ? "" : "unread"
                        }`}
                      >
                        <div>
                          <p style={{ margin: 0 }}>{n.message}</p>
                          <p
                            style={{
                              margin: "4px 0 0",
                              fontSize: 12,
                              color: "#6b7280",
                            }}
                          >
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {!n.read && (
                          <button
                            className="mark-read-btn"
                            onClick={() => markNotificationRead(n.id)}
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    ))
                  )}

                  <h2 style={{ marginTop: 30 }}>🧾 Orders Received</h2>
                  <div className="grid">
                    {shopOrders.length === 0 ? (
                      <p>No orders yet.</p>
                    ) : (
                      shopOrders.map((order) => (
                        <div key={order.id} className="product-card">
                          <h3>{order.buyerName}</h3>
                          <p><strong>Total: ₹{order.total}</strong></p>
                          <p><strong>Payment:</strong> {order.paymentLabel}</p>
                          <p>
                            {order.deliveryAvailable
                              ? "🚚 Delivery Requested"
                              : "🏃 Pickup Only"}
                          </p>
                          <p><strong>Status:</strong> {order.status}</p>
                          <div style={{ textAlign: "left", marginTop: 10 }}>
                            {order.items.map((item, i) => (
                              <p key={i} style={{ fontSize: 14, margin: "2px 0" }}>
                                • {item.name} — ₹{item.price}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {active === "orderHistory" && (
                <div className="table-box">
                  <h2>Order History</h2>
                  {shopOrders.length === 0 ? (
                    <p>No past orders yet.</p>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th style={{ textAlign: "left", padding: 12 }}>Buyer</th>
                          <th style={{ textAlign: "left", padding: 12 }}>Total</th>
                          <th style={{ textAlign: "left", padding: 12 }}>Payment</th>
                          <th style={{ textAlign: "left", padding: 12 }}>Status</th>
                          <th style={{ textAlign: "left", padding: 12 }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shopOrders.map((order) => (
                          <tr key={order.id}>
                            <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{order.buyerName}</td>
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

              {active === "profile" && (
                <div className="table-box">
                  <h2>Profile</h2>
                  <p style={{ marginTop: 12 }}><strong>Name:</strong> {currentUser.name}</p>
                  <p><strong>Email:</strong> {currentUser.email}</p>
                  <p><strong>Role:</strong> Shop Owner</p>
                </div>
              )}

              {active === "settings" && (
                <div className="table-box">
                  <h2>Settings</h2>
                  <p style={{ marginTop: 12 }}>Email Notifications: ON</p>
                  <p>Order Alerts: ON</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OwnerDashboard;