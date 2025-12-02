// middleware/checkApiKey.js
// Standalone API key middleware to avoid circular imports.

export default function checkApiKey(req, res, next) {
  const mySecret = process.env.API_SECRET_KEY;
  const clientKey =
    req.headers["x-api-key"] || req.query.api_key || req.headers["authorization"];

  if (!mySecret) {
    return res.status(500).json({ message: "Server misconfiguration: API key missing" });
  }

  const normalizedClientKey =
    typeof clientKey === "string" && clientKey.toLowerCase().startsWith("bearer ")
      ? clientKey.split(" ")[1]
      : clientKey;

  if (!normalizedClientKey) {
    return res.status(401).json({ message: "Unauthorized: API Key is required" });
  }

  if (normalizedClientKey === mySecret) {
    return next();
  } else {
    return res.status(403).json({ message: "Forbidden: Invalid API Key" });
  }
}
