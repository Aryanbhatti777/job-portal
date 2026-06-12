import { useState, useRef, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { verifyOtp } from "../services/authService";
import axiosInstance from "../utils/axiosInstance";
import styles from "../styles/VerifyOtp.module.css";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const email = new URLSearchParams(location.search).get("email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = useRef([]);

  const handleSubmit = async () => {
  const finalOtp = otp.join("");

  if (!email) {
    setError("Missing email");
    return;
  }

  if (finalOtp.length !== 6) {
    setError("Enter complete OTP");
    return;
  }

  try {
    setLoading(true);
    setError("");

    console.log("Verifying OTP...");

    const otpRes = await verifyOtp({
      email,
      otp: finalOtp,
    });

    console.log("OTP Success:", otpRes.data);

    const userRes = await axiosInstance.get("/profile/me");

    console.log("Profile Success:", userRes.data);

    setUser(userRes.data.user);

    navigate(
      userRes.data.user.role === "admin" ? "/admin" : "/",
      { replace: true }
    );
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    console.error("RESPONSE:", err.response?.data);

    setError(
      err.response?.data?.message ||
      err.message ||
      "OTP verification failed"
    );
  } finally {
    setLoading(false);
  }
};

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }

      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newOtp = [...otp];

    pastedData.split("").forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });

    setOtp(newOtp);

    const lastIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Verify OTP</h2>

        <p className={styles.subtitle}>
          Enter the 6-digit OTP sent to
          <br />
          <strong>{email}</strong>
        </p>

        <div className={styles.otpContainer}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              className={styles.otpInput}
              onChange={(e) =>
                handleChange(index, e.target.value)
              }
              onKeyDown={(e) =>
                handleKeyDown(index, e)
              }
              onPaste={handlePaste}
            />
          ))}
        </div>

        {error && (
          <p className={styles.error}>
            {error}
          </p>
        )}

        <button
          className={styles.button}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
