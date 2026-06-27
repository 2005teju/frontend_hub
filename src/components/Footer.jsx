import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.iconContainer}>
        <a href="#" style={styles.icon}><FaFacebookF /></a>
        <a href="#" style={styles.icon}><FaTwitter /></a>
        <a href="#" style={styles.icon}><FaInstagram /></a>
        <a href="#" style={styles.icon}><FaYoutube /></a>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    width: "100%",
    background: "#1e293b", // 👈 SAME dark color as navbar
    padding: "20px 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "40px",
  },

  iconContainer: {
    display: "flex",
    gap: "30px", // spacing between icons
  },

  icon: {
    fontSize: "20px",
    color: "#ffffff", // 👈 white icons for contrast
    transition: "0.3s",
  },
};

export default Footer;