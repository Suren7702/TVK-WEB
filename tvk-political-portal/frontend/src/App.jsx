// src/App.jsx
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import News from "./pages/News.jsx";
import PartyNetwork from "./pages/PartyNetwork.jsx";
import PartySelector from "./pages/PartySelector.jsx"; // 👈 new
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminRegister from "./pages/AdminRegister";

// --- optional: import the health helper from your API file
// make sure you have src/api/index.js exporting getHealth (see note below)
import { getHealth } from "./api";

export default function App() {
  const [apiStatus, setApiStatus] = useState({
    ok: null, // null = unknown, true = up, false = down
    message: "",
  });

  // Check backend health once on mount (and whenever you want)
  useEffect(() => {
    let mounted = true;

    async function check() {
      try {
        const data = await getHealth();
        if (!mounted) return;
        setApiStatus({ ok: true, message: data?.message || "API ok" });
      } catch (err) {
        if (!mounted) return;
        console.error("Health check failed:", err);
        setApiStatus({
          ok: false,
          message: (err?.response?.data?.message) || "Cannot reach API",
        });
      }
    }

    check();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="app-root">
      <Navbar />

      {/* API status banner */}
      <div style={{ minHeight: 8 }}>
        {apiStatus.ok === true && (
          <div
            style={{
              background: "#e6ffed",
              color: "#0a4d2e",
              padding: "6px 12px",
              textAlign: "center",
              fontSize: 13,
            }}
            role="status"
          >
            Backend connected — {apiStatus.message}
          </div>
        )}

        {apiStatus.ok === false && (
          <div
            style={{
              background: "#ffecec",
              color: "#8b0000",
              padding: "8px 12px",
              textAlign: "center",
              fontSize: 13,
            }}
            role="alert"
          >
            Backend unreachable — {apiStatus.message}. Please check backend or network.
          </div>
        )}
      </div>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/network" element={<PartyNetwork />} />
          <Route path="/barriers" element={<PartySelector />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/secret-register" element={<AdminRegister />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
