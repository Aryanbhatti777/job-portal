import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const { user, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

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

  if (loading) {
    return (
      <nav className={styles.navbar}>
        <Link to="/" className={styles.brand}>
          Satisfying Jobs
        </Link>
      </nav>
    );
  }

  return (
    <nav className={styles.navbar}>
      
      {/* LEFT */}
      <div className={styles.left}>
        <Link to="/" className={styles.brand}>
          Satisfying Jobs
        </Link>
      </div>

      {/* RIGHT */}
      <div className={styles.right}>
        <Link
          to="/"
          className={`${styles.link} ${isActive("/") ? styles.active : ""}`}
        >
          Home
        </Link>

        <Link
          to="/jobs"
          className={`${styles.link} ${isActive("/jobs") ? styles.active : ""}`}
        >
          Jobs
        </Link>
        <Link
          to="/about"
          className={`${styles.link} ${isActive("/about") ? styles.active : ""}`}
        >
          About
        </Link>
        <Link
          to="/contact"
          className={`${styles.link} ${isActive("/contact") ? styles.active : ""}`}
        >
          Contact
        </Link>

        {!user ? (
          <>
            <Link to="/login" className={styles.buttonOutline}>
              Login
            </Link>

            <Link to="/signup" className={styles.buttonPrimary}>
              Signup
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" className={styles.user}>
              <span className={styles.avatar}>{initials}</span>
              <span>{firstName}</span>
            </Link>

            {user.role === "admin" && (
              <Link to="/admin" className={styles.link}>
                Admin
              </Link>
            )}

            <button className={styles.logout} onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;