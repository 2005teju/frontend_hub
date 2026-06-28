import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find(
      (u) =>
        u.email.toLowerCase() ===
        data.email.trim().toLowerCase()
    );

    if (exists) {
      alert("Email already registered.");
      return;
    }

    if (data.role === "admin") {
      const adminExists = users.some(
        (u) => u.role === "admin"
      );

      if (adminExists) {
        alert(
          "Admin account already exists. Only one admin is allowed."
        );
        return;
      }
    }

    const newUser = {
      name: data.name.trim(),
      email: data.email
        .trim()
        .toLowerCase(),
      password: data.password,
      role: data.role,
      loginCount: 0,
      lastLogin: "",
      approved:
        data.role === "owner"
          ? false
          : true,
      products: [],
      notifications:
        data.role === "owner"
          ? [
              {
                id: Date.now(),
                message:
                  "Your shop account is waiting for Admin approval.",
                read: false,
              },
            ]
          : [],
    };

    users.push(newUser);

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

    if (data.role === "owner") {
      alert(
        "Registration successful! Your Shop Owner account is waiting for Admin approval."
      );
    } else {
      alert(
        "Registration Successful!"
      );
    }

    navigate("/login");
  };

  return (
    <div className="hub-register-layout">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:'Plus Jakarta Sans',sans-serif;
        }

        .hub-register-layout{
          min-height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          padding:30px;
          background:
            radial-gradient(circle at top left,#eef2ff 0%,transparent 40%),
            radial-gradient(circle at bottom right,#dcfce7 0%,transparent 40%),
            linear-gradient(135deg,#f8fafc,#ffffff);
        }

        .register-glass-card{
          width:1200px;
          min-height:760px;
          background:rgba(255,255,255,.9);
          backdrop-filter:blur(20px);
          border-radius:35px;
          overflow:hidden;
          display:flex;
          box-shadow:
            0 25px 60px rgba(15,23,42,.12);
        }

        .register-visual-panel{
          flex:1.3;
          background:
            linear-gradient(
              rgba(15,23,42,.15),
              rgba(15,23,42,.75)
            ),
            url("https://workik.com/pstatic/348765/AIWorkspaceCodeFiles/pTDfZG96DmhwuRQ7gReT/AIImages/6168247e-becd-4a45-a440-6e9e9b49d533.png");

          background-size:cover;
          background-position:center;
          padding:60px;
          display:flex;
          flex-direction:column;
          justify-content:flex-end;
          position:relative;
        }

        .brand-marker{
          position:absolute;
          top:45px;
          left:45px;
          color:white;
          font-size:28px;
          font-weight:800;
        }

        .onboarding-content{
          background:rgba(15,23,42,.45);
          backdrop-filter:blur(20px);
          padding:40px;
          border-radius:30px;
          color:white;
        }

        .onboarding-content h1{
          font-size:50px;
          margin-bottom:15px;
        }

        .onboarding-content p{
          color:#e2e8f0;
          line-height:1.7;
        }

        .register-form-panel{
          flex:1;
          padding:55px;
          display:flex;
          flex-direction:column;
          justify-content:center;
        }

        .tag{
          display:inline-block;
          padding:8px 16px;
          background:#eef2ff;
          color:#4f46e5;
          border-radius:50px;
          font-size:14px;
          font-weight:700;
          margin-bottom:20px;
        }

        .reg-greet{
          margin-bottom:35px;
        }

        .reg-greet h2{
          font-size:40px;
          color:#0f172a;
          margin-bottom:10px;
        }

        .reg-greet p{
          color:#64748b;
        }

        .form-grid{
          display:flex;
          flex-direction:column;
          gap:20px;
        }

        .reg-group label{
          display:block;
          margin-bottom:8px;
          font-size:13px;
          font-weight:700;
          color:#475569;
        }

        .reg-input{
          width:100%;
          padding:18px;
          border:2px solid #e2e8f0;
          border-radius:18px;
          background:#f8fafc;
          font-size:15px;
          outline:none;
        }

        .reg-input:focus{
          border-color:#6366f1;
          background:white;
        }

        /* NEW: password field wrapper + eye icon button */
        .password-field-wrapper{
          position:relative;
          width:100%;
        }

        .password-field-wrapper .reg-input{
          padding-right:50px;
        }

        .password-toggle-btn{
          position:absolute;
          right:14px;
          top:50%;
          transform:translateY(-50%);
          background:none;
          border:none;
          cursor:pointer;
          color:#64748b;
          display:flex;
          align-items:center;
          padding:4px;
        }

        .password-toggle-btn:hover{
          color:#4f46e5;
        }

        .btn-register-prime{
          width:100%;
          padding:18px;
          border:none;
          border-radius:18px;
          background:
            linear-gradient(
              135deg,
              #6366f1,
              #4f46e5
            );
          color:white;
          font-size:16px;
          font-weight:700;
          cursor:pointer;
          margin-top:10px;
        }

        .btn-register-prime:hover{
          transform:translateY(-2px);
        }

        .reg-footer{
          text-align:center;
          margin-top:30px;
          color:#64748b;
        }

        .reg-footer span{
          color:#4f46e5;
          font-weight:700;
          cursor:pointer;
        }

        @media(max-width:1000px){
          .register-visual-panel{
            display:none;
          }

          .register-glass-card{
            width:100%;
            max-width:550px;
          }

          .register-form-panel{
            padding:40px 30px;
          }
        }
      `}</style>

      <div className="register-glass-card">
        <div className="register-visual-panel">
          <div className="brand-marker">
            📍 Nearby Hub
          </div>

          <div className="onboarding-content">
            <h1>Claim Your Spot.</h1>

            <p>
              Connect, discover, and grow with
              your local community.
            </p>
          </div>
        </div>

        <div className="register-form-panel">
          <div className="tag">
            🚀 Join Nearby Hub
          </div>

          <div className="reg-greet">
            <h2>Create Account</h2>

            <p>
              Start your digital neighborhood
              journey.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="form-grid"
          >
            <div className="reg-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                className="reg-input"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="reg-group">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                className="reg-input"
                placeholder="Enter email"
                required
              />
            </div>

            <div className="reg-group">
              <label>Select Role</label>

              <select
                name="role"
                value={data.role}
                onChange={handleChange}
                className="reg-input"
              >
                <option value="user">
                  User
                </option>

                <option value="owner">
                  Shop Owner
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>
            </div>

            <div className="reg-group">
              <label>Password</label>

              {/* NEW: wrapper + eye toggle for Password */}
              <div className="password-field-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  className="reg-input"
                  placeholder="Create password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="reg-group">
              <label>
                Confirm Password
              </label>

              {/* NEW: wrapper + eye toggle for Confirm Password */}
              <div className="password-field-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={handleChange}
                  className="reg-input"
                  placeholder="Confirm password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-register-prime"
            >
              Create Account →
            </button>
          </form>

          <p className="reg-footer">
            Already have an account?{" "}
            <span
              onClick={() =>
                navigate("/login")
              }
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;