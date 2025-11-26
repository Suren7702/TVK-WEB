import mongoose from "mongoose";

const partyUnitSchema = new mongoose.Schema({
  // Hierarchy Info
  nameTa: { type: String, required: true }, // Name of the place (e.g., "Manapparai")
  type: { 
    type: String, 
    enum: ["union", "village", "ward", "booth"], 
    required: true 
  },
  // Parent Link (A Village belongs to a Union ID, etc.)
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "PartyUnit", 
    default: null 
  },
  
  // Person Info (The In-charge)
  person: { type: String, default: "" },  // Name
  roleTa: { type: String, default: "" },  // Position (e.g. Secretary)
  phone: { type: String, default: "" },   // Contact
  photo: { type: String, default: "" },   // Image URL

  // Optional: If you really need multiple bearers per unit, use an array
  // bearers: [{ name: String, role: String, phone: String }] 
}, { timestamps: true });

export default mongoose.model("PartyUnit", partyUnitSchema);