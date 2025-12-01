import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../api.js";
import { saveAuth } from "../auth.js";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // IMPORTANT: use the full API route that matches your backend
      const { data } = await API.post("/api/auth/login", {
        email: email.trim(),
        password,
      });

      // debug: uncomment if you need logs
      // console.log("login response:", data);

      // Destructure data for cleaner access
      const { _id, name, email: userEmail, role, token } = data;

      // Role Check
      if (role !== "admin") {
        setError("Admin account only allowed");
        setLoading(false);
        return;
      }

      // Save Auth Info (Token and User Data)
      saveAuth(token, { _id, name, email: userEmail, role });

      // Set Authorization Header for future requests
      setAuthToken(token);

      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-wrap auth-page">
      <div className="auth-card">
        <h1 className="section-heading-ta">நிர்வாக உள்நுழைவு</h1>
        <p className="section-subheading-ta">
          கட்சி நிர்வாகிகள் மட்டும் பயன்படுத்தும் பாதுகாப்பான பகுதி.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="form-label-ta">
            மின்னஞ்சல் (Email)
            <input
              type="email"
              className="input"
              placeholder="admin@tvkportal.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="form-label-ta">
            கடவுச்சொல் (Password)
            <input
              type="password"
              className="input"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Signing in..." : "உள்நுழைக"}
          </button>
        </form>
      </div>
    </section>
  );
}
