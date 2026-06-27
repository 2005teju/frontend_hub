import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) =>
        u.email?.trim().toLowerCase() ===
          data.email.trim().toLowerCase() &&
        u.password === data.password
    );

    if (!user) {
      setError(
        "Invalid email or password. Please try again."
      );
      return;
    }

    if (!user.role) {
      setError(
        "User role not found. Please register again."
      );
      return;
    }

    // Store current user
    localStorage.setItem(
      "currentUser",
      JSON.stringify(user)
    );

    // Store login history for Admin Dashboard
    const loginHistory =
      JSON.parse(
        localStorage.getItem("loginHistory")
      ) || [];

    loginHistory.push({
      name: user.name,
      email: user.email,
      role: user.role,
      loginTime: new Date().toLocaleString(),
    });

    localStorage.setItem(
      "loginHistory",
      JSON.stringify(loginHistory)
    );

    switch (user.role.toLowerCase()) {
      case "admin":
        navigate("/admin");
        break;

      case "owner":
        navigate("/owner");
        break;

      case "user":
        navigate("/user");
        break;

      default:
        setError("Invalid user role.");
        localStorage.removeItem(
          "currentUser"
        );
    }
  };

  return (
    <div className="hub-auth-layout">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
        }

        .hub-auth-layout{
          min-height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          padding:20px;
          font-family:'Plus Jakarta Sans',sans-serif;
          background:
          radial-gradient(
            circle at top left,
            #eef2ff,
            #ffffff
          );
        }

        .auth-glass-card{
          width:1200px;
          max-width:100%;
          min-height:720px;
          display:flex;
          overflow:hidden;
          border-radius:40px;
          background:#fff;
          box-shadow:
          0 25px 60px
          rgba(0,0,0,0.12);
        }

        .visual-branding-panel{
          flex:1.4;
          background:
          linear-gradient(
            rgba(15,23,42,.2),
            rgba(15,23,42,.7)
          ),
          url(
          'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a'
          );

          background-size:cover;
          background-position:center;
          padding:60px;
          display:flex;
          flex-direction:column;
          justify-content:flex-end;
          position:relative;
          color:white;
        }

        .brand-logo-area{
          position:absolute;
          top:50px;
          left:50px;
        }

        .brand-logo-area h2{
          font-size:30px;
          font-weight:800;
        }

        .clear-content-box{
          background:
          rgba(255,255,255,0.12);
          backdrop-filter:blur(10px);
          padding:35px;
          border-radius:25px;
        }

        .clear-content-box h1{
          font-size:50px;
          margin-bottom:15px;
        }

        .clear-content-box p{
          line-height:1.7;
          font-size:18px;
        }

        .auth-form-panel{
          flex:1;
          display:flex;
          flex-direction:column;
          justify-content:center;
          padding:60px;
        }

        .form-greet{
          margin-bottom:40px;
        }

        .form-greet h2{
          font-size:42px;
          font-weight:800;
          color:#0f172a;
        }

        .form-greet p{
          color:#64748b;
          margin-top:10px;
        }

        .form-group{
          margin-bottom:25px;
          position:relative;
        }

        .form-group label{
          display:block;
          margin-bottom:10px;
          font-weight:700;
          font-size:14px;
        }

        .form-input-field{
          width:100%;
          padding:18px;
          border:2px solid #e2e8f0;
          border-radius:18px;
          font-size:16px;
          outline:none;
          transition:.3s;
        }

        .form-input-field:focus{
          border-color:#6366f1;
          box-shadow:
          0 0 0 4px
          rgba(99,102,241,.15);
        }

        .pass-toggle{
          position:absolute;
          right:20px;
          top:48px;
          cursor:pointer;
        }

        .auth-controls{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:30px;
          font-size:14px;
        }

        .auth-controls a{
          text-decoration:none;
          color:#6366f1;
          font-weight:600;
        }

        .btn-submit-prime{
          width:100%;
          padding:18px;
          border:none;
          border-radius:18px;
          background:
          linear-gradient(
            135deg,
            #6366f1,
            #8b5cf6
          );
          color:white;
          font-size:16px;
          font-weight:700;
          cursor:pointer;
          transition:.3s;
        }

        .btn-submit-prime:hover{
          transform:translateY(-3px);
          box-shadow:
          0 20px 35px
          rgba(99,102,241,.35);
        }

        .auth-footer{
          margin-top:30px;
          text-align:center;
          color:#64748b;
        }

        .auth-footer a{
          text-decoration:none;
          color:#6366f1;
          font-weight:700;
          margin-left:6px;
        }

        .error-toast{
          background:#fef2f2;
          color:#dc2626;
          padding:14px;
          border-radius:14px;
          margin-bottom:20px;
          font-weight:600;
        }

        @media(max-width:900px){
          .visual-branding-panel{
            display:none;
          }

          .auth-form-panel{
            padding:40px 30px;
          }
        }
      `}</style>

      <div className="auth-glass-card">
        <div className="visual-branding-panel">
          <div className="brand-logo-area">
            <h2>📍 Nearby Hub</h2>
          </div>

          <div className="clear-content-box">
            <h1>Smart City. Smarter You</h1>
            <p>
              All your neighborhood essentials,
              connected in one smart hub.
            </p>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="form-greet">
            <h2>Welcome Back</h2>
            <p>Your local hub, now digital.</p>
          </div>

          {error && (
            <div className="error-toast">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email ID</label>

              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                className="form-input-field"
                placeholder="neighbor@hub.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type={
                  showPass
                    ? "text"
                    : "password"
                }
                name="password"
                value={data.password}
                onChange={handleChange}
                className="form-input-field"
                placeholder="••••••••"
                required
              />

              <span
                className="pass-toggle"
                onClick={() =>
                  setShowPass(!showPass)
                }
              >
                {showPass ? "🔒" : "👁️"}
              </span>
            </div>

            <div className="auth-controls">
              <label>
                <input type="checkbox" />
                {" "}Remember me
              </label>

              <Link to="#">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn-submit-prime"
            >
              Join Dashboard →
            </button>
          </form>

          <div className="auth-footer">
            New to Hub?
            <Link to="/register">
              Start your journey
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;