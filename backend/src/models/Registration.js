import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Please provide your phone number"],
    },
    numberOfTickets: {
      type: Number,
      required: [true, "Please provide number of tickets"],
      min: [1, "At least 1 ticket is required"],
    },
    status: {
      type: String,
      enum: ["Registered", "Cancelled", "Attended"],
      default: "Registered",
    },
  },
  { timestamps: true },
);

// Ensure one email can register only once per event
registrationSchema.index({ eventId: 1, email: 1 }, { unique: true });

export default mongoose.model("Registration", registrationSchema);
