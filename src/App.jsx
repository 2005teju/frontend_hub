import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import UserDashboard from "./pages/user/UserDashboard";

// 🔐 Protected Route
const ProtectedRoute = ({ children, role }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (role && currentUser.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Navbar />

      <div style={{ minHeight: "80vh", padding: "20px" }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner"
            element={
              <ProtectedRoute role="owner">
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;


