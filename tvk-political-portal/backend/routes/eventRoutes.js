// backend/routes/eventRoutes.js
import express from "express";
import {
  getEvents,
  createEvent,
  deleteEvent
} from "../controllers/eventController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// public – list all events
router.get("/", getEvents);

// admin – manage events
router.post("/", protect, adminOnly, createEvent);
router.delete("/:id", protect, adminOnly, deleteEvent);

export default router;
