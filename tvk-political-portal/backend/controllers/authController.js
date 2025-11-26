import jwt from "jsonwebtoken";
import User from "../models/User.js";

// --- CONFIGURATION ---
// This is the secret password required to register as an Admin.
// You can change "Maanbumigu2026" to anything you want.
const ADMIN_SECRET = "Maanbumigu2026"; 

// Helper: Generate JWT Token
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ==========================================
// 1. REGISTER (Strict Admin Only)
// ==========================================
export const registerAdmin = async (req, res) => {
  const { name, email, password, secretKey } = req.body;

  try {
    // A. Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists (மின்னஞ்சல் ஏற்கனவே உள்ளது)" });
    }

    // B. Validate Secret Key (Strict Check)
    // If the key is wrong or missing, we REJECT the registration.
    if (secretKey !== ADMIN_SECRET) {
      return res.status(403).json({ message: "Invalid Admin Secret Key! (தவறான ரகசிய குறியீடு)" });
    }

    // C. Create the Admin User
    // Note: We pass 'password' directly. Your User.js model handles the hashing automatically.
    const user = await User.create({
      name,
      email,
      password, 
      role: "admin" // Force role to admin since key matched
    });

    // D. Respond
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: "Admin Account Created Successfully! ✅"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ==========================================
// 2. LOGIN
// ==========================================
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    // Check if user exists AND password matches
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Send back User info + Token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ==========================================
// 3. GET ME (Validate Token)
// ==========================================
export const getMe = async (req, res) => {
  try {
    // req.user is already populated by the 'protect' middleware
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching profile" });
  }
};