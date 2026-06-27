import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <span style={styles.logoIcon}>📍</span>
        Nearby Hub
      </div>

      <div style={styles.menu}>
        <Link
          to="/"
          style={{
            ...styles.link,
            color: location.pathname === "/" ? "#38bdf8" : "#ffffff",
          }}
        >
          Home
        </Link>

        <Link
          to="/about"
          style={{
            ...styles.link,
            color: location.pathname === "/about" ? "#38bdf8" : "#ffffff",
          }}
        >
          About
        </Link>

        <Link
          to="/contact"
          style={{
            ...styles.link,
            color: location.pathname === "/contact" ? "#38bdf8" : "#ffffff",
          }}
        >
          Contact
        </Link>

        <Link
          to="/login"
          style={{
            ...styles.link,
            color: location.pathname === "/login" ? "#38bdf8" : "#ffffff",
          }}
        >
          Login
        </Link>

        <Link
          to="/register"
          style={{
            ...styles.link,
            color: location.pathname === "/register" ? "#38bdf8" : "#ffffff",
          }}
        >
          Register
        </Link>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 60px",
    background: "rgba(15, 23, 42, 0.85)",
    backdropFilter: "blur(10px)",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  logo: {
    fontSize: "24px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },

  logoIcon: {
    fontSize: "26px",
  },

  menu: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
  },

  link: {
    textDecoration: "none",
    fontSize: "16px",
    color: "#ffffff",
    transition: "0.3s",
  },
};

export default Navbar;