import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AppContext } from "../context/AppContext";
import Toast from "../components/Toast";

export default function Register() {
  const navigate = useNavigate();
  const { loading, setLoading } = useContext(AppContext);

  const [error, setError] = useState("");
  const [step, setStep] = useState("form"); // form | otp
  const [otp, setOtp] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    phone: "",
    password: "",
    role: "customer",
  });

  /* Redirect after success */
  useEffect(() => {
    if (!success) return;

    const timer = setInterval(() => {
      setCountdown((c) => c - 1);
    }, 1000);

    if (countdown === 0) {
      navigate("/login", { replace: true });
    }

    return () => clearInterval(timer);
  }, [success, countdown, navigate]);

  /* REGISTER */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", formData);
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* VERIFY OTP */
  const handleVerify = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await api.post("/auth/verify-otp", {
        phone: formData.phone,
        otp,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* RESEND OTP */
  const handleResend = async () => {
    try {
      await api.post("/auth/resend-otp", { phone: formData.phone });
    } catch {
      setError("Failed to resend OTP");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        {error && <Toast message={error} />}

        {success ? (
          <p>Redirecting to login in {countdown} seconds...</p>
        ) : step === "otp" ? (
          <form onSubmit={handleVerify} style={styles.form}>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={styles.input}
            />

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button type="button" onClick={handleResend} style={styles.linkBtn}>
              Resend OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              placeholder="Company Name"
              style={styles.input}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
            />

            <input
              placeholder="Full Name"
              required
              style={styles.input}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              placeholder="Phone Number"
              required
              style={styles.input}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              required
              style={styles.input}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <select
              value={formData.role}
              style={styles.input}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="customer">Customer</option>
              <option value="driver">Driver</option>
              <option value="admin">Admin</option>
            </select>

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>
        )}

        <p style={{ marginTop: 16 }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
  },
  card: {
    width: 420,
    padding: 30,
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  input: {
    padding: 10,
    fontSize: 14,
  },
  button: {
    padding: 12,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#2563eb",
    cursor: "pointer",
  },
};
