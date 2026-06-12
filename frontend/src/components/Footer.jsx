import { Link } from "react-router-dom";
import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.footerGrid}>
        
        <div className={styles.footerBrand}>
          <h3>Satisfying Jobs</h3>
          <p>
            Helping talent find opportunity with honest listings, trusted employers,
            and a seamless hiring experience.
          </p>
        </div>

        <div>
          <h4>Company</h4>
          <Link to="/">Home</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/login">Login</Link>
        </div>

        <div>
          <h4>Explore</h4>
          <a href="/about">About</a>
          <a href="contact">Contact</a>
          <a href="/jobs">Jobs</a>
        </div>

        <div>
          <h4>Contact</h4>
          <p>pawan93200@gmail.com</p>
          <p>+91 93060 39200</p>
          <p>Shop no. 158, Mahalaxmi Market, Dabra chowk, Hisar</p>
        </div>

      </div>

      <div className={styles.footerBottom}>
        <p>© 2026 Satisfying Jobs. All rights reserved.</p>
        <p>Designed for fast hiring and meaningful career matches.</p>
      </div>
    </footer>
  );
};

export default Footer;