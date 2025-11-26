import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../api.js";
import { saveAuth } from "../auth.js";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await API.post("/auth/login", { email, password });

      // data = { _id, name, email, role, token }
      if (data.role !== "admin") {
        setError("Admin account only allowed");
        return;
      }

      saveAuth(data.token, {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role
      });

      setAuthToken(data.token);

      // ✅ redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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

          <button type="submit" className="btn btn-primary btn-full">
            உள்நுழைக
          </button>
        </form>
      </div>
    </section>
  );
}
