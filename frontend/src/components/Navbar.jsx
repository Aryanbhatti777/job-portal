import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const { user, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const initials = user?.name
    ?.split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const firstName = user?.name?.split(" ")[0] || "Profile";

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  if (loading) {
    return (
      <nav className={styles.navbar}>
        <Link to="/" className={styles.brand}>
          Satisfying Jobs
        </Link>
      </nav>
    );
  }

  const NavLinks = () => (
    <>
      <Link onClick={closeMenu} to="/" className={`${styles.link} ${isActive("/") ? styles.active : ""}`}>
        Home
      </Link>

      <Link onClick={closeMenu} to="/jobs" className={`${styles.link} ${isActive("/jobs") ? styles.active : ""}`}>
        Jobs
      </Link>

      <Link onClick={closeMenu} to="/about" className={`${styles.link} ${isActive("/about") ? styles.active : ""}`}>
        About
      </Link>

      <Link onClick={closeMenu} to="/contact" className={`${styles.link} ${isActive("/contact") ? styles.active : ""}`}>
        Contact
      </Link>

      {user && user.role === "admin" && (
        <Link onClick={closeMenu} to="/admin" className={styles.link}>
          Admin
        </Link>
      )}

      {!user ? (
        <>
          <Link onClick={closeMenu} to="/login" className={styles.buttonOutline}>
            Login
          </Link>

          <Link onClick={closeMenu} to="/signup" className={styles.buttonPrimary}>
            Signup
          </Link>
        </>
      ) : (
        <>
          <Link onClick={closeMenu} to="/profile" className={styles.user}>
            <span className={styles.avatar}>{initials}</span>
            <span>{firstName}</span>
          </Link>

          <button className={styles.logout} onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </>
  );

  return (
    <nav className={styles.navbar}>
  {/* LEFT */}
  <div className={styles.left}>
    <Link to="/" className={styles.brand}>
      Satisfying Jobs
    </Link>
  </div>

  {/* HAMBURGER (MOVE HERE) */}
  <button
    className={styles.hamburger}
    onClick={() => setMenuOpen(true)}
  >
    ☰
  </button>

  {/* DESKTOP MENU */}
  <div className={styles.right}>
    <NavLinks />
  </div>

  {/* OVERLAY */}
  <div
    className={`${styles.overlay} ${menuOpen ? styles.showOverlay : ""}`}
    onClick={closeMenu}
  />

  {/* DRAWER */}
  <div className={`${styles.drawer} ${menuOpen ? styles.open : ""}`}>
    <button className={styles.closeBtn} onClick={closeMenu}>
      ✕
    </button>

    <NavLinks />
  </div>
</nav>
  );
};

export default Navbar;