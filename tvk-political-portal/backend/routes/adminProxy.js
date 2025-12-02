// backend/routes/adminProxy.js
import express from "express";

const router = express.Router();

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  try {
    return { ok: res.ok, status: res.status, body: JSON.parse(text) };
  } catch (e) {
    return { ok: res.ok, status: res.status, body: text };
  }
}

function getBaseUrl(req) {
  const proto = req.protocol || "http";
  const host = req.get("host");
  return `${proto}://${host}`;
}

// NEW: robust verifyAdmin that accepts Authorization header OR Cookie
async function verifyAdmin(req) {
  // prefer Authorization header
  const authHeader = req.headers["authorization"];
  const cookieHeader = req.headers["cookie"]; // if you use cookie-based auth/session

  if (!authHeader && !cookieHeader) {
    return { ok: false, status: 401, message: "Authorization token is missing. Access denied." };
  }

  const base = getBaseUrl(req);
  const url = `${base}/api/auth/me`;

  // forward whichever is present
  const headers = { "Content-Type": "application/json" };
  if (authHeader) headers["Authorization"] = authHeader;
  if (cookieHeader) headers["Cookie"] = cookieHeader;

  const result = await fetchJson(url, {
    method: "GET",
    headers,
  });

  if (!result.ok) {
    // pass through message if available
    const msg = result.body?.message || "Auth check failed";
    return { ok: false, status: result.status, message: msg };
  }

  const user = result.body;
  if (!user || user.role !== "admin") return { ok: false, status: 403, message: "Admin required" };

  return { ok: true, user };
}

// rest of file: same proxies as before
router.post("/party-network/add", async (req, res) => {
  try {
    const verified = await verifyAdmin(req);
    if (!verified.ok) return res.status(verified.status).json({ message: verified.message });

    const base = getBaseUrl(req);
    const dest = `${base}/api/party-network/add`;
    const serverKey = process.env.API_SECRET_KEY;
    if (!serverKey) return res.status(500).json({ message: "Server misconfiguration: API_SECRET_KEY missing" });

    const forwardRes = await fetchJson(dest, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": serverKey,
      },
      body: JSON.stringify(req.body),
    });

    return res.status(forwardRes.status).json(forwardRes.body);
  } catch (err) {
    console.error("adminProxy add error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/party-network/:id", async (req, res) => {
  try {
    const verified = await verifyAdmin(req);
    if (!verified.ok) return res.status(verified.status).json({ message: verified.message });

    const base = getBaseUrl(req);
    const dest = `${base}/api/party-network/${req.params.id}`;
    const serverKey = process.env.API_SECRET_KEY;
    if (!serverKey) return res.status(500).json({ message: "Server misconfiguration: API_SECRET_KEY missing" });

    const forwardRes = await fetchJson(dest, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": serverKey,
      },
      body: JSON.stringify(req.body),
    });

    return res.status(forwardRes.status).json(forwardRes.body);
  } catch (err) {
    console.error("adminProxy put error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/party-network/:id", async (req, res) => {
  try {
    const verified = await verifyAdmin(req);
    if (!verified.ok) return res.status(verified.status).json({ message: verified.message });

    const base = getBaseUrl(req);
    const dest = `${base}/api/party-network/${req.params.id}`;
    const serverKey = process.env.API_SECRET_KEY;
    if (!serverKey) return res.status(500).json({ message: "Server misconfiguration: API_SECRET_KEY missing" });

    const forwardRes = await fetchJson(dest, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": serverKey,
      },
      body: JSON.stringify(req.body || {}),
    });

    return res.status(forwardRes.status).json(forwardRes.body);
  } catch (err) {
    console.error("adminProxy delete error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
