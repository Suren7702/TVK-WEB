import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import partyRoutes from "./routes/partyRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("TVK Political Portal API running");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "TVK Political Portal backend is running",
    time: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/party", partyRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/party-network", partyRoutes);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const checkApiKey = (req, res, next) => {
  // The key must match the one you set in Vercel Env Vars
  const mySecret = process.env.API_SECRET_KEY; 
  const clientKey = req.headers['x-api-key'];

  if (clientKey && clientKey === mySecret) {
    next(); // Allowed!
  } else {
    res.status(403).json({ message: 'Forbidden: Invalid API Key' });
  }
};

// Use this middleware on your routes
app.get('/api/your-endpoint', checkApiKey, (req, res) => {
  res.json({ message: "Hello from Secure Azure!" });
});
