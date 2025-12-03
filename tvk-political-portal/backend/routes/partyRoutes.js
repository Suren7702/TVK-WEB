import express from "express";
import { 
  addPartyUnit, 
  getPartyNetwork, 
  deletePartyUnit, 
  updatePartyUnit // <--- Make sure this is imported
} from "../controllers/partyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPartyNetwork);
router.post("/add", protect, addPartyUnit);
router.delete("/:id", protect, deletePartyUnit);

// ✅ ADD THIS LINE (The missing link):
router.put("/:id", protect, updatePartyUnit); 

export default router;