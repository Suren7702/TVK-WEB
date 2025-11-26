// backend/models/Event.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true }, // photo URL
    date: { type: Date },
    location: { type: String }
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
