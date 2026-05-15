import express from "express";
import {
  registerForEvent,
  getAllRegistrations,
  getRegistrationById,
  getRegistrationsByEvent,
  updateRegistration,
  cancelRegistration,
  getUserRegistrations,
} from "../controllers/registrationController.js";

const router = express.Router();

// Main routes
router.post("/", registerForEvent);
router.get("/", getAllRegistrations);
router.get("/:id", getRegistrationById);
router.put("/:id", updateRegistration);
router.delete("/:id", cancelRegistration);

// Event registrations
router.get("/event/:eventId", getRegistrationsByEvent);

// User registrations by email
router.get("/user/:email", getUserRegistrations);

export default router;
