import React, { useState, useEffect } from "react";

export default function AdminDashboard({ onLogout }) {
  const [active, setActive] = useState("overview");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [shopRequests, setShopRequests] = useState([]);
  const [messages, setMessages] = useState([]);

  // ── NEW: which owner's accordion is expanded (only one at a time) ──
  const [expandedOwner, setExpandedOwner] = useState(null);

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) || {};

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    const storedProducts =
      JSON.parse(localStorage.getItem("products")) || [];

    const storedShopRequests =
      JSON.parse(
        localStorage.getItem("shopVerificationRequests")
      ) || [];

    const storedMessages =
      JSON.parse(localStorage.getItem("contactMessages")) || [];

    setUsers(storedUsers);
    setProducts(storedProducts);
    setShopRequests(storedShopRequests);
    setMessages(storedMessages);
  };

  const totalUsers = users.filter((u) => u.role === "user").length;
  const totalOwners = users.filter((u) => u.role === "owner").length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;

  const loggedUsers = users.filter(
    (u) => u.role === "user" && (u.loginCount || 0) > 0
  );

  const loggedOwners = users.filter(
    (u) => u.role === "owner" && (u.loginCount || 0) > 0
  );

  const pendingOwners = users.filter(
    (u) => u.role === "owner" && !u.approved
  );

  const pendingShopVerifications = shopRequests.filter(
    (r) => !r.approved
  );

  const navItems = [
    { icon: "📊", label: "Overview", key: "overview" },
    { icon: "👥", label: "Users", key: "users" },
    { icon: "🏪", label: "Shop Owners", key: "shops" },
    { icon: "✅", label: "Approvals", key: "approvals" },
    { icon: "📋", label: "Shop Verification", key: "shopVerification" },
    { icon: "🛒", label: "Products", key: "products" },
    { icon: "✉️", label: "Messages", key: "messages" },
    { icon: "⚙️", label: "Settings", key: "settings" },
  ];

  const currentTab =
    navItems.find((n) => n.key === active) || navItems[0];

  const approveOwner = (email) => {
    const updatedUsers = users.map((u) =>
      u.email === email ? { ...u, approved: true } : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    alert("Owner Approved Successfully");
  };

  const approveShop = (email) => {
    const shop =
      JSON.parse(localStorage.getItem(`shop_${email}`)) || {};
    shop.verified = true;
    localStorage.setItem(`shop_${email}`, JSON.stringify(shop));

    const updatedRequests = shopRequests.map((r) =>
      r.email === email ? { ...r, approved: true } : r
    );
    localStorage.setItem(
      "shopVerificationRequests",
      JSON.stringify(updatedRequests)
    );
    setShopRequests(updatedRequests);
    alert("Shop Verified Successfully");
  };

  const updateQuality = (id, quality) => {
    const updatedProducts = products.map((p) =>
      p.id === id ? { ...p, quality } : p
    );
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };

  // ── NEW: group products by owner (ownerEmail) for the accordion view ──
  const productsByOwner = products.reduce((acc, p) => {
    const key = p.ownerEmail || "unknown";
    if (!acc[key]) {
      acc[key] = {
        ownerEmail: p.ownerEmail,
        ownerName: p.ownerName || "Unknown Owner",
        shopName: p.shopName || "",
        items: [],
      };
    }
    acc[key].items.push(p);
    return acc;
  }, {});

  const ownerGroups = Object.values(productsByOwner);

  const toggleOwner = (ownerEmail) => {
    setExpandedOwner((prev) =>
      prev === ownerEmail ? null : ownerEmail
    );
  };

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

        .logo span{
          color:#10b981;
        }

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

        .dash-main{
          flex:1;
          padding:35px;
        }

        .topbar{
          background:white;
          padding:30px;
          border-radius:20px;
          margin-bottom:30px;
        }

        .cards{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(230px,1fr));
          gap:20px;
        }

        .card{
          background:white;
          padding:30px;
          border-radius:20px;
          box-shadow:0 8px 25px rgba(0,0,0,.08);
        }

        .card h1{
          margin-top:15px;
        }

        .table-box{
          background:white;
          padding:30px;
          border-radius:20px;
        }

        table{
          width:100%;
          border-collapse:collapse;
          margin-top:20px;
        }

        th,td{
          padding:15px;
          border-bottom:1px solid #eee;
        }

        .approval-row{
          display:flex;
          justify-content:space-between;
          align-items:center;
          border:1px solid #eee;
          padding:20px;
          border-radius:15px;
          margin-top:20px;
        }

        .approve-btn{
          background:#10b981;
          color:white;
          border:none;
          padding:12px 20px;
          border-radius:10px;
          cursor:pointer;
        }

        .shop-detail-grid{
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:10px;
          margin:15px 0;
        }

        .shop-detail-grid p{
          font-size:14px;
          color:#374151;
        }

        .product-card{
          background:#fff;
          border:1px solid #eee;
          border-radius:18px;
          padding:20px;
          margin-bottom:20px;
        }

        .product-card img{
          width:120px;
          height:120px;
          object-fit:cover;
          border-radius:12px;
          margin-top:15px;
        }

        select{
          padding:10px;
          border-radius:10px;
          margin-top:10px;
        }

        .message-card{
          border:1px solid #eee;
          border-radius:15px;
          padding:20px;
          margin-top:20px;
          background:#fafafa;
        }

        .message-card h4{
          margin-bottom:6px;
          color:#111827;
        }

        .message-card .msg-meta{
          font-size:13px;
          color:#6b7280;
          margin-bottom:10px;
        }

        .message-card .msg-body{
          color:#374151;
          line-height:1.6;
          white-space:pre-wrap;
        }

        /* ── NEW: owner accordion styles ─────────────────────────────────── */
        .owner-accordion{
          border:1px solid #e5e7eb;
          border-radius:16px;
          margin-top:18px;
          overflow:hidden;
        }

        .owner-accordion-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:20px 25px;
          background:#f8fafc;
          cursor:pointer;
        }

        .owner-accordion-header:hover{
          background:#eef2f7;
        }

        .owner-accordion-header-left{
          display:flex;
          align-items:center;
          gap:15px;
        }

        .owner-accordion-arrow{
          font-size:14px;
          transition:transform .2s ease;
        }

        .owner-accordion-arrow.open{
          transform:rotate(90deg);
        }

        .owner-accordion-title h3{
          color:#111827;
          margin-bottom:2px;
        }

        .owner-accordion-title p{
          font-size:13px;
          color:#6b7280;
        }

        .owner-accordion-count{
          background:#10b981;
          color:white;
          padding:6px 14px;
          border-radius:20px;
          font-size:13px;
          font-weight:600;
        }

        .owner-accordion-body{
          padding:20px 25px;
          background:#fff;
        }
        /* ──────────────────────────────────────────────────────────────────── */
      `}</style>

      <div className="dash-layout">
        <aside className="dash-sidebar">
          <div>
            <div className="logo">
              Nearby<span>Hub</span>
            </div>

            <div className="sidebar-user">
              <div className="avatar">
                {currentUser.name?.charAt(0)}
              </div>

              <div>
                <h4>{currentUser.name}</h4>
                <p>Administrator</p>
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

          {active === "overview" && (
            <div className="cards">
              <div className="card">
                <h3>Total Users</h3>
                <h1>{totalUsers}</h1>
              </div>
              <div className="card">
                <h3>Shop Owners</h3>
                <h1>{totalOwners}</h1>
              </div>
              <div className="card">
                <h3>Admins</h3>
                <h1>{totalAdmins}</h1>
              </div>
              <div className="card">
                <h3>Logged Users</h3>
                <h1>{loggedUsers.length}</h1>
              </div>
              <div className="card">
                <h3>Logged Owners</h3>
                <h1>{loggedOwners.length}</h1>
              </div>
              <div className="card">
                <h3>Pending Approvals</h3>
                <h1>{pendingOwners.length}</h1>
              </div>
              <div className="card">
                <h3>Pending Shop Verifications</h3>
                <h1>{pendingShopVerifications.length}</h1>
              </div>
            </div>
          )}

          {active === "users" && (
            <div className="table-box">
              <h2>Users</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Logins</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((u) => u.role === "user")
                    .map((u) => (
                      <tr key={u.email}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.loginCount || 0}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {active === "shops" && (
            <div className="table-box">
              <h2>Shop Owners</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((u) => u.role === "owner")
                    .map((u) => (
                      <tr key={u.email}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.approved ? "Approved" : "Pending"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {active === "approvals" && (
            <div className="table-box">
              <h2>Owner Approval Requests</h2>
              {pendingOwners.length === 0 ? (
                <p>No Pending Requests</p>
              ) : (
                pendingOwners.map((owner) => (
                  <div key={owner.email} className="approval-row">
                    <div>
                      <h3>{owner.name}</h3>
                      <p>{owner.email}</p>
                    </div>
                    <button
                      className="approve-btn"
                      onClick={() => approveOwner(owner.email)}
                    >
                      Approve
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {active === "shopVerification" && (
            <div className="table-box">
              <h2>Shop Verification Requests</h2>
              {pendingShopVerifications.length === 0 ? (
                <p>No Pending Shop Verifications</p>
              ) : (
                pendingShopVerifications.map((req) => (
                  <div
                    key={req.email}
                    className="approval-row"
                    style={{ flexDirection: "column", alignItems: "stretch" }}
                  >
                    <div>
                      <h3>{req.shopName}</h3>
                      <p>{req.email}</p>
                    </div>
                    <div className="shop-detail-grid">
                      <p><strong>Owner:</strong> {req.name}</p>
                      <p><strong>Phone:</strong> {req.phone}</p>
                      <p><strong>Address:</strong> {req.address}</p>
                      <p><strong>GST ID:</strong> {req.gstId}</p>
                      <p><strong>Customer License:</strong> {req.customerLicense}</p>
                    </div>
                    <button
                      className="approve-btn"
                      onClick={() => approveShop(req.email)}
                    >
                      Verify Shop
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── REDESIGNED: Products grouped by owner, accordion style ── */}
          {active === "products" && (
            <div className="table-box">
              <h2>Owner Products</h2>

              {ownerGroups.length === 0 ? (
                <p>No Products Added</p>
              ) : (
                ownerGroups.map((group) => {
                  const isOpen = expandedOwner === group.ownerEmail;
                  return (
                    <div className="owner-accordion" key={group.ownerEmail}>
                      <div
                        className="owner-accordion-header"
                        onClick={() => toggleOwner(group.ownerEmail)}
                      >
                        <div className="owner-accordion-header-left">
                          <span
                            className={`owner-accordion-arrow ${
                              isOpen ? "open" : ""
                            }`}
                          >
                            ▶
                          </span>
                          <div className="owner-accordion-title">
                            <h3>{group.ownerName}</h3>
                            {group.shopName && <p>{group.shopName}</p>}
                          </div>
                        </div>
                        <span className="owner-accordion-count">
                          {group.items.length} Products
                        </span>
                      </div>

                      {isOpen && (
                        <div className="owner-accordion-body">
                          {group.items.map((p) => (
                            <div key={p.id} className="product-card">
                              <h3>{p.name}</h3>
                              <p>Owner: {p.ownerName}</p>
                              <p>Price: ₹{p.price}</p>
                              <p>{p.description}</p>
                              <img
                                src={
                                  p.image ||
                                  "https://via.placeholder.com/150"
                                }
                                alt=""
                              />
                              <div>
                                <h4>Product Quality</h4>
                                <select
                                  value={p.quality || ""}
                                  onChange={(e) =>
                                    updateQuality(p.id, e.target.value)
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="Good">Good</option>
                                  <option value="Average">Average</option>
                                  <option value="Poor">Poor</option>
                                </select>
                                <p>
                                  Status: {p.quality || "Not Reviewed"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {active === "messages" && (
            <div className="table-box">
              <h2>Contact Messages</h2>
              {messages.length === 0 ? (
                <p>No Messages Yet</p>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className="message-card">
                    <h4>{msg.name}</h4>
                    <p className="msg-meta">
                      {msg.email}
                      {msg.sentAt
                        ? ` · ${new Date(msg.sentAt).toLocaleString()}`
                        : ""}
                    </p>
                    <p className="msg-body">{msg.message}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {active === "settings" && (
            <div className="table-box">
              <h2>System Settings</h2>
              <p>Email Notifications: ON</p>
              <p>Maintenance Mode: OFF</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}