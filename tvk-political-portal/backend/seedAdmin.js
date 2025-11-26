// backend/seedAdmin.js
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const email = "admin@tvkportal.com"; // ⚙️ change if you want
    const password = "Admin@123";        // ⚙️ change if you want
    const name = "Suren";                // ⚙️ change if you want

    // check if already exists
    const exists = await User.findOne({ email });
    if (exists) {
      console.log("Admin already exists with email:", email);
      process.exit(0);
    }

    const admin = await User.create({
      name,
      email,
      password,
      role: "admin"
    });

    console.log("✅ Admin created successfully");
    console.log("Email:", admin.email);
    console.log("Use this password to login:", password);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  }
};

createAdmin();
