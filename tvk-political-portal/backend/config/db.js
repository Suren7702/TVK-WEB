// config/db.js
import mongoose from "mongoose";

const connectDB = async (mongoURI) => {
  // prefer provided param, then common env names
  const uri =
    mongoURI ||
    process.env.MONGO_URI ||
    process.env.MONGO_URL ||
    process.env.MONGODB_URI ||
    process.env.DATABASE_URL;

  if (!uri) {
    console.error(
      "ERROR: MongoDB URI not found. Set one of: MONGO_URI, MONGO_URL, MONGODB_URI, DATABASE_URL"
    );
    // fail fast so Render/host shows a clear error
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri, {
      // recommended options by mongoose (most are default in v6+)
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message || err);
    // rethrow or exit depending on your preference; we exit to make deployment fail visibly
    process.exit(1);
  }
};

export default connectDB;
