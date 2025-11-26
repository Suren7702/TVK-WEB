import express from "express";
import {
  getNews,
  createNews,
  updateNews,
  deleteNews
} from "../controllers/newsController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// public
router.get("/", getNews);

// ✅ admin only
router.post("/", protect, adminOnly, createNews);
router.put("/:id", protect, adminOnly, updateNews);
router.delete("/:id", protect, adminOnly, deleteNews);

export default router;
