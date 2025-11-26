import express from "express";
import { registerAdmin, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin); // Points to the new secure function
router.post("/login", login);
router.get("/me", protect, getMe);

export default router;