import React, { useState, useEffect } from "react";

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

const OwnerDashboard = () => {
  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) || {};

  const savedShop =
    JSON.parse(
      localStorage.getItem(
        `shop_${currentUser.email}`
      )
    ) || {};

  const [approved, setApproved] = useState(false);
  const [step, setStep] = useState(1);

  const [owner, setOwner] = useState({
    name:
      savedShop.name ||
      currentUser.name ||
      "",
    phone: savedShop.phone || "",
    shopName: savedShop.shopName || "",
    address: savedShop.address || "",
    gstId: savedShop.gstId || "",
    customerLicense: savedShop.customerLicense || "",
    verified: savedShop.verified || false,
  });

  const [products, setProducts] = useState([]);

  // ── NEW: order notifications + the orders themselves, for this shop ──
  const [notifications, setNotifications] = useState([]);
  const [shopOrders, setShopOrders] = useState([]);
  // ──────────────────────────────────────────────────────────────────────

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

  const loadData = () => {
    const users =
      JSON.parse(localStorage.getItem("users")) ||
      [];

    const ownerUser = users.find(
      (u) => u.email === currentUser.email
    );

    setApproved(ownerUser?.approved || false);

    const allProducts =
      JSON.parse(
        localStorage.getItem("products")
      ) || [];

    setProducts(
      allProducts.filter(
        (p) =>
          p.ownerEmail ===
          currentUser.email
      )
    );

    // ── NEW: pull in this shop's order notifications + orders ──
    const allNotifications =
      JSON.parse(
        localStorage.getItem("notifications")
      ) || [];

    setNotifications(
      allNotifications
        .filter((n) => n.ownerEmail === currentUser.email)
        .sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
    );

    const allOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    setShopOrders(
      allOrders
        .filter((o) => o.ownerEmail === currentUser.email)
        .sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
    );
    // ──────────────────────────────────────────────────────────────────
  };

  // ── NEW: mark one order notification as read ──
  const markNotificationRead = (id) => {
    const allNotifications =
      JSON.parse(localStorage.getItem("notifications")) || [];

    const updated = allNotifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );

    localStorage.setItem(
      "notifications",
      JSON.stringify(updated)
    );

    setNotifications(
      updated
        .filter((n) => n.ownerEmail === currentUser.email)
        .sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
    );
  };

  const unreadNotificationCount = notifications.filter(
    (n) => !n.read
  ).length;
  // ──────────────────────────────────────────────────────────────────────

  const handleOwnerChange = (e) => {
    const { name, value } = e.target;

    setOwner((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = (e) => {
    const {
      name,
      value,
      checked,
      type,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const saveShopDetails = () => {
    const shopData = {
      name: owner.name.trim(),
      phone: owner.phone.trim(),
      shopName:
        owner.shopName.trim(),
      address:
        owner.address.trim(),
      gstId: owner.gstId.trim(),
      customerLicense: owner.customerLicense.trim(),
      verified: savedShop.verified || false,
    };

    if (
      !shopData.name ||
      !shopData.phone ||
      !shopData.shopName ||
      !shopData.address ||
      !shopData.gstId ||
      !shopData.customerLicense
    ) {
      alert(
        "Please fill all required fields."
      );
      return;
    }

    localStorage.setItem(
      `shop_${currentUser.email}`,
      JSON.stringify(shopData)
    );

    const requests =
    JSON.parse(
      localStorage.getItem(
        "shopVerificationRequests"
      )
    ) || [];

  const index = requests.findIndex(
    (r) =>
      r.email === currentUser.email
  );

  const requestData = {
    email: currentUser.email,
    ...shopData,
    approved: false,
  };

  if (index >= 0) {
    requests[index] = requestData;
  } else {
    requests.push(requestData);
  }

  localStorage.setItem(
    "shopVerificationRequests",
    JSON.stringify(requests)
  );


    setOwner(shopData);

    alert(
      "Shop details saved successfully waiting for admin verification."
    );
  };

  const addProduct = () => {
    if (
      !form.name ||
      !form.price ||
      !form.quantity ||
      !form.category
     ) {
      alert(
        "Please enter product name, price, quantity and category."
      );
      return;
    }

    const newProduct = {
      id: Date.now(),
      ownerEmail:
        currentUser.email,
      ownerName:
        currentUser.name,
      shopName:
        owner.shopName,
      name: form.name,
      price: form.price,
      quantity: form.quantity,
      category: form.category,
      image: form.image,
      description:
        form.description,
      delivery:
        form.delivery,
      quality: "Pending",
    };

    const allProducts =
      JSON.parse(
        localStorage.getItem(
          "products"
        )
      ) || [];

    const updatedProducts = [
      ...allProducts,
      newProduct,
    ];

    localStorage.setItem(
      "products",
      JSON.stringify(
        updatedProducts
      )
    );

    setProducts(
      updatedProducts.filter(
        (p) =>
          p.ownerEmail ===
          currentUser.email
      )
    );

    setForm({
      name: "",
      price: "",
      quantity: "",
      category: "",
      image: "",
      description: "",
      delivery: false,
    });

    alert(
      "Product Added Successfully."
    );
  };

  const deleteProduct = (id) => {
    const allProducts =
      JSON.parse(
        localStorage.getItem(
          "products"
        )
      ) || [];

    const updatedProducts =
      allProducts.filter(
        (p) => p.id !== id
      );

    localStorage.setItem(
      "products",
      JSON.stringify(
        updatedProducts
      )
    );

    setProducts(
      updatedProducts.filter(
        (p) =>
          p.ownerEmail ===
          currentUser.email
      )
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        🏪 Shop Owner Dashboard
      </h1>

      {!approved ? (
        <div style={styles.pendingBox}>
          <h2>
            ⏳ Waiting for Admin
            Approval
          </h2>

          <p>
            Your account has been
            created. Please wait
            until the admin approves
            your request.
          </p>
        </div>
      ) : (
        <>
        {step === 1 && (
            <div style={styles.card}>
              <img
                src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1200"
                alt="Shop"
                style={styles.bannerImage}
              />

              <h2 style={styles.heading}>
                🏪 Shop Details
              </h2>

              {!owner.verified ? (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Owner Name"
                    value={owner.name || ""}
                    onChange={handleOwnerChange}
                    style={styles.input}
                  />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={owner.phone || ""}
                    onChange={handleOwnerChange}
                    style={styles.input}
                  />

                  <input
                    type="text"
                    name="shopName"
                    placeholder="Shop Name"
                    value={owner.shopName || ""}
                    onChange={handleOwnerChange}
                    style={styles.input}
                  />

                  <input
                    type="text"
                    name="address"
                    placeholder="Shop Address"
                    value={owner.address || ""}
                    onChange={handleOwnerChange}
                    style={styles.input}
                  />

                  <input
                    type="text"
                    name="gstId"
                    placeholder="GST ID"
                    value={owner.gstId || ""}
                    onChange={handleOwnerChange}
                    style={styles.input}
                  />

                  <input
                    type="text"
                    name="customerLicense"
                    placeholder="Customer License Number"
                    value={owner.customerLicense || ""}
                    onChange={handleOwnerChange}
                    style={styles.input}
                  />

                  <button
                    style={styles.button}
                    onClick={saveShopDetails}
                  >
                    Submit for Verification
                  </button>

                  {owner.shopName && (
                    <p
                      style={{
                        color: "#dc2626",
                        textAlign: "center",
                        marginTop: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      ⏳ Waiting for Admin Verification.
                      Products can be added only after
                      approval.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div style={styles.verifiedSummary}>
                    <p>
                      <strong>Owner Name:</strong>{" "}
                      {owner.name}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {owner.phone}
                    </p>
                    <p>
                      <strong>Shop Name:</strong>{" "}
                      {owner.shopName}
                    </p>
                    <p>
                      <strong>Address:</strong>{" "}
                      {owner.address}
                    </p>
                    <p>
                      <strong>GST ID:</strong>{" "}
                      {owner.gstId}
                    </p>
                    <p>
                      <strong>
                        Customer License:
                      </strong>{" "}
                      {owner.customerLicense}
                    </p>
                  </div>

                  <p
                    style={{
                      color: "#16a34a",
                      textAlign: "center",
                      marginTop: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    ✅ Your shop has been verified by
                    the admin. You can now add products.
                  </p>

                  <button
                    style={{
                      ...styles.button,
                      marginTop: "10px",
                    }}
                    onClick={() => setStep(2)}
                  >
                    Continue To Products →
                  </button>
                </>
              )}
            </div>
          )}

          {step === 2 &&
            owner.verified && (
            <>
              <div style={styles.card}>
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200"
                  alt="Products"
                  style={styles.bannerImage}
                />

                <h2 style={styles.heading}>
                  🛒 Add Product
                </h2>

                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={form.name}
                  onChange={handleChange}
                  style={styles.input}
                />

                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleChange}
                  style={styles.input}
                />

                <input
                  type="text"
                  name="quantity"
                  placeholder="Quantity (e.g. 1 Kg, 2 Liters)"
                  value={form.quantity}
                  onChange={handleChange}
                  style={styles.input}
                />

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">
                    Select Category
                  </option>
                  {CATEGORY_OPTIONS.map(
                    (cat) => (
                      <option
                        key={cat}
                        value={cat}
                      >
                        {cat}
                      </option>
                    )
                  )}
                </select>

                <input
                  type="text"
                  name="image"
                  placeholder="Image URL"
                  value={form.image}
                  onChange={handleChange}
                  style={styles.input}
                />

                <textarea
                  name="description"
                  placeholder="Product Description"
                  value={form.description}
                  onChange={handleChange}
                  style={styles.textarea}
                />

                <label style={styles.checkbox}>
                  <input
                    type="checkbox"
                    name="delivery"
                    checked={form.delivery}
                    onChange={handleChange}
                  />
                  Delivery Available
                </label>

                <button
                  style={styles.button}
                  onClick={addProduct}
                >
                  Add Product
                </button>

                <button
                  style={styles.backBtn}
                  onClick={() =>
                    setStep(1)
                  }
                >
                  ← Back
                </button>
              </div>

              <h2 style={styles.subTitle}>
                My Products
              </h2>

              <div style={styles.grid}>
                {products.length === 0 ? (
                  <p
                    style={{
                      color: "#fff",
                      textAlign:
                        "center",
                      gridColumn:
                        "1/-1",
                    }}
                  >
                    No products added
                    yet.
                  </p>
                ) : (
                  products.map((p) => (
                    <div
                      key={p.id}
                      style={
                        styles.product
                      }
                    >
                      <img
                        src={
                          p.image ||
                          "https://via.placeholder.com/250"
                        }
                        alt={p.name}
                        style={
                          styles.image
                        }
                      />

                      <h3>{p.name}</h3>

                      <p>
                        <strong>
                          ₹{p.price}
                        </strong>
                      </p>

                      <p>
                        <strong>
                          Quantity:
                        </strong>{" "}
                        {p.quantity}
                      </p>

                      <p>
                        <strong>
                          Category:
                        </strong>{" "}
                        {p.category}
                      </p>

                      <p>
                        {
                          p.description
                        }
                      </p>

                      <p>
                        {p.delivery
                          ? "🚚 Delivery Available"
                          : "❌ No Delivery"}
                      </p>

                      <p>
                        <strong>
                          Quality:
                        </strong>{" "}
                        {p.quality}
                      </p>

                      <button
                        style={
                          styles.deleteBtn
                        }
                        onClick={() =>
                          deleteProduct(
                            p.id
                          )
                        }
                      >
                        Delete Product
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* ── NEW: Order Notifications ─────────────────────────── */}
              <h2 style={styles.subTitle}>
                📦 Order Notifications
                {unreadNotificationCount > 0
                  ? ` (${unreadNotificationCount} new)`
                  : ""}
              </h2>

              <div style={styles.card}>
                {notifications.length === 0 ? (
                  <p>No notifications yet.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        ...styles.notificationRow,
                        ...(n.read
                          ? {}
                          : styles.notificationRowUnread),
                      }}
                    >
                      <div>
                        <p style={{ margin: 0 }}>
                          {n.message}
                        </p>
                        <p
                          style={{
                            margin: "4px 0 0",
                            fontSize: "12px",
                            color: "#6b7280",
                          }}
                        >
                          {new Date(
                            n.createdAt
                          ).toLocaleString()}
                        </p>
                      </div>

                      {!n.read && (
                        <button
                          style={styles.markReadBtn}
                          onClick={() =>
                            markNotificationRead(n.id)
                          }
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* ── NEW: Orders Received ────────────────────────────────── */}
              <h2 style={styles.subTitle}>
                🧾 Orders Received
              </h2>

              <div style={styles.grid}>
                {shopOrders.length === 0 ? (
                  <p
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      gridColumn: "1/-1",
                    }}
                  >
                    No orders yet.
                  </p>
                ) : (
                  shopOrders.map((order) => (
                    <div
                      key={order.id}
                      style={styles.product}
                    >
                      <h3>{order.buyerName}</h3>

                      <p>
                        <strong>
                          Total: ₹{order.total}
                        </strong>
                      </p>

                      <p>
                        <strong>Payment:</strong>{" "}
                        {order.paymentLabel}
                      </p>

                      <p>
                        {order.deliveryAvailable
                          ? "🚚 Delivery Requested"
                          : "🏃 Pickup Only"}
                      </p>

                      <p>
                        <strong>Status:</strong>{" "}
                        {order.status}
                      </p>

                      <div
                        style={{
                          textAlign: "left",
                          marginTop: "10px",
                        }}
                      >
                        {order.items.map((item, i) => (
                          <p
                            key={i}
                            style={{
                              fontSize: "14px",
                              margin: "2px 0",
                            }}
                          >
                            • {item.name} — ₹{item.price}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {/* ──────────────────────────────────────────────────────────── */}
            </>
            )}
        </>
      )}
    </div>
  );
};
const styles = {
  container: {
    padding: "30px",
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #1e3c72, #2a5298)",
    fontFamily: "Arial, sans-serif",
  },

  title: {
    textAlign: "center",
    color: "#fff",
    marginBottom: "30px",
    fontSize: "36px",
  },

  subTitle: {
    textAlign: "center",
    color: "#fff",
    marginTop: "40px",
    marginBottom: "20px",
  },

  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "20px",
    maxWidth: "650px",
    margin: "20px auto",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.2)",
  },

  bannerImage: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "15px",
    marginBottom: "20px",
  },

  heading: {
    textAlign: "center",
    color: "#1e3c72",
    marginBottom: "20px",
    fontSize: "28px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    minHeight: "100px",
    fontSize: "16px",
    boxSizing: "border-box",
  },

  checkbox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
    fontSize: "16px",
  },

  button: {
    width: "100%",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },

  backBtn: {
    width: "100%",
    background: "#6b7280",
    color: "#fff",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    marginTop: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },

  verifiedSummary: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "10px",
    padding: "18px 20px",
    marginBottom: "10px",
    lineHeight: "1.7",
  },

  pendingBox: {
    background: "#fff",
    padding: "50px",
    borderRadius: "20px",
    maxWidth: "600px",
    margin: "100px auto",
    textAlign: "center",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.2)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },

  product: {
    background: "#fff",
    borderRadius: "15px",
    padding: "20px",
    textAlign: "center",
    boxShadow:
      "0 6px 15px rgba(0,0,0,0.15)",
  },

  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "15px",
  },

  deleteBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    marginTop: "15px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  // ── NEW: notification row styles ──
  notificationRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    padding: "12px 0",
    borderBottom: "1px solid #eee",
  },

  notificationRowUnread: {
    background: "#eff6ff",
    borderRadius: "8px",
    padding: "12px",
  },

  markReadBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },
};

export default OwnerDashboard;