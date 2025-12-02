// middleware/checkApiKey.js
import crypto from "crypto";

function getClientKeyFromRequest(req) {
  // Priority: x-api-key header -> Authorization Bearer -> query param
  const h1 = req.headers["x-api-key"];
  if (h1) return String(h1).trim();

  const auth = req.headers["authorization"];
  if (typeof auth === "string") {
    // Support "Bearer <token>" and plain token
    const parts = auth.split(/\s+/);
    if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
      return parts[1].trim();
    }
    // if it's a single token string like "tokenvalue"
    if (parts.length === 1) return parts[0].trim();
  }

  if (req.query && req.query.api_key) return String(req.query.api_key).trim();

  return null;
}

export default function checkApiKey(req, res, next) {
  const serverKey = process.env.API_SECRET_KEY;
  if (!serverKey) {
    // misconfiguration — 500 so you notice in logs
    return res.status(500).json({ message: "Server misconfiguration: API key missing" });
  }

  const clientKey = getClientKeyFromRequest(req);

  // Log presence (do NOT log the actual key)
  console.log("checkApiKey — key present:", !!clientKey, "source:", clientKey ? (req.headers["x-api-key"] ? "x-api-key" : (req.headers["authorization"] ? "authorization" : "query")) : "none");

  if (!clientKey) {
    return res.status(401).json({ message: "Unauthorized: API Key is required" });
  }

  // constant-time compare to avoid timing leaks
  try {
    const a = Buffer.from(clientKey);
    const b = Buffer.from(String(serverKey));

    // If lengths differ, quick fail (timingSafeEqual requires same length)
    if (a.length !== b.length) {
      return res.status(403).json({ message: "Forbidden: Invalid API Key" });
    }
    const equal = crypto.timingSafeEqual(a, b);
    if (equal) return next();
    return res.status(403).json({ message: "Forbidden: Invalid API Key" });
  } catch (err) {
    console.error("checkApiKey error:", err && err.message ? err.message : err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
