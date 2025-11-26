import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api.js"; // Ensure this points to your axios setup

export default function AdminRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    secretKey: "" // This is the most important field for Admins
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send data to backend
      const response = await API.post("/auth/register", form);
      
      // If successful
      alert(response.data.message || "Admin account created successfully!");
      navigate("/admin/login"); // Send them to login page
    } catch (err) {
      // Show error from backend
      setError(
        err.response?.data?.message || "பதிவு தோல்வியடைந்தது. (Registration Failed)"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-wrap auth-page">
      <div className="auth-card" style={{ borderTop: "5px solid #d9534f" }}>
        <h1 className="form-title-ta">நிர்வாகி பதிவு (Admin Only)</h1>
        <p className="status-text" style={{ color: "#d9534f", fontWeight: "bold" }}>
          எச்சரிக்கை: இது நிர்வாகிகளுக்கான பக்கம் மட்டுமே.
        </p>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <label className="form-label-ta">பெயர்</label>
          <input
            name="name"
            type="text"
            className="input"
            placeholder="உங்கள் பெயர்"
            value={form.name}
            onChange={handleChange}
            required
          />

          {/* Email */}
          <label className="form-label-ta">மின்னஞ்சல்</label>
          <input
            name="email"
            type="email"
            className="input"
            placeholder="admin@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <label className="form-label-ta">கடவுச்சொல்</label>
          <input
            name="password"
            type="password"
            className="input"
            placeholder="******"
            value={form.password}
            onChange={handleChange}
            required
          />

          {/* SECRET KEY - The Gatekeeper */}
          <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#fff5f5", borderRadius: "5px", border: "1px dashed #d9534f" }}>
            <label className="form-label-ta" style={{ color: "#d9534f" }}>
              ரகசிய குறியீடு (Secret Key)
            </label>
            <input
              name="secretKey"
              type="password"
              className="input"
              placeholder="Enter Admin Secret Code"
              value={form.secretKey}
              onChange={handleChange}
              required
            />
            <small style={{ display: "block", marginTop: "5px", color: "#777", fontSize: "0.8rem" }}>
              * இந்த குறியீடு தெரிந்தால் மட்டுமே Admin ஆக முடியும்.
            </small>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: "20px", backgroundColor: "#d9534f", borderColor: "#d9534f" }}
          >
            {loading ? "பதிவாகிறது..." : "Confirm Admin Registration"}
          </button>
        </form>

        <div className="auth-footer-link">
          <Link to="/admin/login">Login Page (திரும்பச் செல்)</Link>
        </div>
      </div>
    </section>
  );
}