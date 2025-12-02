// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import partyRoutes from "./routes/partyRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

// new middleware imports
import requestLogger from "./middleware/requestLogger.js"; // debug logger
// do NOT import checkApiKey here (it's used by routes) to avoid circular imports

dotenv.config();

const app = express();

// --- CORS ---
const corsOptions = {
  origin: process.env.FRONTEND_URL || "https://tvk-web.vercel.app",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "x-api-key"],
  credentials: true,
  optionsSuccessStatus: 204,
};

// handle preflight for all routes
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

// --- Body Parsers ---
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// --- DEBUG request logger (short-term; safe to keep while debugging) ---
// Log basic headers and parsed body so you can see what arrives on Render
app.use(requestLogger);

// --- Register all routes (Base paths) ---
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/party-network", partyRoutes);
app.use("/api/events", eventRoutes);

// --- Basic health routes ---
app.get("/", (req, res) => {
  res.send("TVK Political Portal API running");
});

// --- Start server after DB connected ---
const startServer = async () => {
  try {
    await connectDB(); // wait for DB connection before starting server
    console.log("✅ Database connected, starting HTTP server...");

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );

    // Graceful shutdown on SIGINT/SIGTERM
    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Closing server...`);
      server.close(() => {
        console.log("HTTP server closed.");
        process.exit(0);
      });
    };
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

  } catch (err) {
    console.error("Failed to start server — DB connection error:", err);
    process.exit(1);
  }
};

startServer();

process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at Promise:", p, "reason:", reason);
});
