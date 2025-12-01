// routes/partyRoutes.js
import express from "express";
import {
  addPartyUnit,
  getPartyNetwork,
  deletePartyUnit,
  updatePartyUnit
} from "../controllers/partyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all network (public or protected depending on your design)
router.get("/", getPartyNetwork);

// Allow POST to either / (preferred) OR /add (legacy) so both client variants work.
// Both are protected (only admin allowed) — keep protect middleware.
router.post("/", protect, addPartyUnit);
router.post("/add", protect, addPartyUnit);

// Update & delete
router.put("/:id", protect, updatePartyUnit);
router.delete("/:id", protect, deletePartyUnit);

export default router;
