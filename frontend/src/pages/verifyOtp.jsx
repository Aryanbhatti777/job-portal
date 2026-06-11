import { useState, useRef, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { verifyOtp } from "../services/authService";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const email = new URLSearchParams(location.search).get("email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const finalOtp = otp.join("");

    if (!email) return setError("Missing email");
    if (finalOtp.length !== 6) return setError("Enter full OTP");

    try {
      setLoading(true);

      const res = await verifyOtp({
        email,
        otp: finalOtp,
      });

      // backend must return actual user
      const user = await axiosInstance.get("/profile/me");

      setUser(user.data.user);

      navigate(user.data.user.role === "admin" ? "/admin" : "/", {
        replace: true,
      });

    } catch (err) {
      setError(err.response?.data?.message || "OTP failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>

      <p>Sent to: {email}</p>

      {otp.map((v, i) => (
        <input
          key={i}
          value={v}
          maxLength={1}
          onChange={(e) => {
            const copy = [...otp];
            copy[i] = e.target.value.slice(-1);
            setOtp(copy);
          }}
        />
      ))}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
};

export default VerifyOtp;