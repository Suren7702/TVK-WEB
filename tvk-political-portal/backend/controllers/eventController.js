// backend/controllers/eventController.js
import Event from "../models/Event.js";

// GET /api/events  (public)
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1, createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events" });
  }
};

// POST /api/events  (admin)
export const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Error creating event" });
  }
};

// DELETE /api/events/:id  (admin)
export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting event" });
  }
};
