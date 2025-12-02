// routes/adminProxy.js
import express from "express";

const router = express.Router();

/**
 * Proxy route for admin actions that require the server secret.
 * - Verifies caller is an admin by calling /api/auth/me with the same Authorization header.
 * - Forwards the request to the internal /api/party-network routes using API_SECRET_KEY.
 *
 * NOTE: This implementation uses the same host to call internal endpoints.
 * Make sure your backend can call itself via the Host header (it normally can).
 */

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
  // Build base URL for internal calls: preserve protocol + host
  // note: during containerized deployment this will resolve to external host; that's OK.
  const proto = req.protocol || "http";
  const host = req.get("host");
  return `${proto}://${host}`;
}

// Helper: check admin using existing /api/auth/me endpoint
async function verifyAdmin(req) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return { ok: false, status: 401, message: "Missing Authorization header" };

  const base = getBaseUrl(req);
  const url = `${base}/api/auth/me`;
  const result = await fetchJson(url, {
    method: "GET",
    headers: { "Authorization": authHeader, "Content-Type": "application/json" },
  });

  if (!result.ok) return { ok: false, status: result.status, message: result.body?.message || "Auth check failed" };

  // result.body expected to contain user info; check role === 'admin'
  const user = result.body;
  if (!user || user.role !== "admin") return { ok: false, status: 403, message: "Admin required" };

  return { ok: true, user };
}

// POST /api/admin/party-network/add  -> forwards to /api/party-network/add (server-side secret)
router.post("/party-network/add", async (req, res) => {
  try {
    const verified = await verifyAdmin(req);
    if (!verified.ok) return res.status(verified.status).json({ message: verified.message });

    const base = getBaseUrl(req);
    const dest = `${base}/api/party-network/add`;

    // Forward the request using server secret
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

// PUT /api/admin/party-network/:id  -> forwards to /api/party-network/:id
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

// DELETE /api/admin/party-network/:id  -> forwards to /api/party-network/:id
router.delete("/party-network/:id", async (req, res) => {
  try {
    const verified = await verifyAdmin(req);
    if (!verified.ok) return res.status(verified.status).json({ message: verified.message });

    const base = getBaseUrl(req);
    const dest = `${base}/api/party-network/${req.params.id}`;

    const serverKey = process.env.API_SECRET_KEY;
    if (!serverKey) return res.status(500).json({ message: "Server misconfiguration: API_SECRET_KEY missing" });

    // If client passed a body (e.g., level) we forward it
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
