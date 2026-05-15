import express from "express";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByCategory,
  getUpcomingEvents,
} from "../controllers/eventController.js";

const router = express.Router();

// Main routes
router.get("/", getAllEvents);
router.get("/upcoming", getUpcomingEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

// Category route
router.get("/category/:category", getEventsByCategory);

export default router;
