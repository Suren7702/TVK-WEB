import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Import Middleware
import requestLogger from "./middleware/requestLogger.js"; 
import checkAuth from "./middleware/checkAuth.js";

// Import Routes (Only partyRoutes is shown as an example)
import partyRoutes from "./routes/partyRoutes.js";

dotenv.config();

const app = express();

// --- Basic Health Route (UNAUTHENTICATED) ---
// Frontend calls this for status check: GET /
app.get("/", (req, res) => {
  res.send("TVK Political Portal API running");
});

// --- CORS Configuration ---
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Use your actual frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "x-api-key"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

// --- Body Parsers ---
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// --- DEBUG request logger ---
app.use(requestLogger);

// --------------------------------------------------------------------
// 💡 STEP 1: Register UN-AUTHENTICATED Routes (MUST go before checkAuth)
// All routes registered here are public (only checked for API key if HTTP method is POST/PUT/DELETE)
// --------------------------------------------------------------------
// Maps public read routes (e.g., GET /api/party-network/)
app.use("/api/party-network", partyRoutes.unauthenticated); 


// 🔒 --------------------------------------------------------------------
// STEP 2: GLOBAL SECURITY MIDDLEWARE 
// All routes defined BELOW this line require the API Key check.
// --------------------------------------------------------------------
app.use(checkAuth); 


// --------------------------------------------------------------------
// STEP 3: Register AUTHENTICATED API routes (Require API Key + Token)
// --------------------------------------------------------------------
// Maps authenticated routes (e.g., POST /api/party-network/add)
app.use("/api/party-network", partyRoutes.authenticated); 
// app.use("/api/admin", adminRoutes); // Add other authenticated routes here


// --- Start server after DB connected ---
const startServer = async () => {
  try {
    await connectDB(); 

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("Failed to start server — DB connection error:", err);
    process.exit(1);
  }
};

startServer();

process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at Promise:", p, "reason:", reason);
});