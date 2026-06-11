import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/Login.module.css";

const Login = () => {
  const navigate = useNavigate();

  const { user, fetchUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  useEffect(() => {
    if (user) {
      navigate(
        user.role === "admin"
          ? "/admin"
          : "/",
        { replace: true }
      );
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await loginUser(form);

      const currentUser =
        await fetchUser();

      navigate(
        currentUser?.role ===
          "admin"
          ? "/admin"
          : "/",
        {
          replace: true,
        }
      );
    } catch (err) {
      alert(
        err.response?.data
          ?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h2>Welcome Back</h2>

          <p>
            Login to access your
            account and continue
            your career journey.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <div
            className={
              styles.formGroup
            }
          >
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              placeholder="you@example.com"
              onChange={
                handleChange
              }
              required
            />
          </div>

          <div
            className={
              styles.formGroup
            }
          >
            <label>Password</label>

            <div
              className={
                styles.passwordField
              }
            >
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={
                  form.password
                }
                placeholder="Enter your password"
                onChange={
                  handleChange
                }
                required
              />

              <button
                type="button"
                className={
                  styles.passwordToggle
                }
                onClick={() =>
                  setShowPassword(
                    (prev) =>
                      !prev
                  )
                }
              >
                {showPassword
                  ? "🙈"
                  : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={
              styles.loginBtn
            }
          >
            {loading
              ? "Logging In..."
              : "Login"}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Don't have an account? <Link to="/signup">
            Create Account
          </Link>
          </p>

          
        </div>
      </div>
    </div>
  );
};

export default Login;