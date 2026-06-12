import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { requestOtp } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/Signup.module.css";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "seeker"
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin" : "/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // force role here (important even if someone manipulates frontend)
      const payload = {
        ...form,
        role: "seeker"
      };

      await requestOtp(payload);

      navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`, {
        replace: true
      });
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>Create Account</h2>
          <p>Join and start applying for jobs</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              placeholder="Alice Johnson"
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              placeholder="you@example.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <div className={styles.passwordField}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                placeholder="Create a password"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button className={styles.button} disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;