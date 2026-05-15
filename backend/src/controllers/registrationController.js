import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

// @desc    Register user for an event
// @route   POST /api/registrations
// @access  Public
export const registerForEvent = async (req, res) => {
  try {
    const { eventId, name, email, phone, numberOfTickets } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if event has available capacity
    if (event.registeredCount + numberOfTickets > event.capacity) {
      return res.status(400).json({
        success: false,
        message: `Not enough capacity. Available seats: ${event.capacity - event.registeredCount}`,
      });
    }

    // Check if user already registered for this event
    const existingRegistration = await Registration.findOne({ eventId, email });
    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this event",
      });
    }

    // Create registration
    const registration = await Registration.create({
      eventId,
      name,
      email,
      phone,
      numberOfTickets,
    });

    // Update event registered count
    event.registeredCount += numberOfTickets;
    await event.save();

    res.status(201).json({
      success: true,
      data: registration,
      message: "Successfully registered for the event",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all registrations
// @route   GET /api/registrations
// @access  Public
export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find().populate(
      "eventId",
      "title date location",
    );

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get registration by ID
// @route   GET /api/registrations/:id
// @access  Public
export const getRegistrationById = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id).populate(
      "eventId",
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get registrations for an event
// @route   GET /api/registrations/event/:eventId
// @access  Public
export const getRegistrationsByEvent = async (req, res) => {
  try {
    const registrations = await Registration.find({
      eventId: req.params.eventId,
    }).populate("eventId", "title");

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update registration
// @route   PUT /api/registrations/:id
// @access  Public
export const updateRegistration = async (req, res) => {
  try {
    let registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    registration = await Registration.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      data: registration,
      message: "Registration updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel registration
// @route   DELETE /api/registrations/:id
// @access  Public
export const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    // Update event registered count
    const event = await Event.findById(registration.eventId);
    if (event) {
      event.registeredCount -= registration.numberOfTickets;
      await event.save();
    }

    await Registration.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Registration cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user registrations by email
// @route   GET /api/registrations/user/:email
// @access  Public
export const getUserRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      email: req.params.email,
    }).populate("eventId", "title date location");

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
