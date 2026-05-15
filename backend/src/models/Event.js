import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide an event title"],
      trim: true,
      maxlength: [100, "Event title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide an event description"],
      maxlength: [500, "Event description cannot exceed 500 characters"],
    },
    date: {
      type: Date,
      required: [true, "Please provide an event date"],
    },
    time: {
      type: String,
      required: [true, "Please provide an event time"],
    },
    location: {
      type: String,
      required: [true, "Please provide an event location"],
    },
    capacity: {
      type: Number,
      required: [true, "Please provide event capacity"],
      min: [1, "Capacity must be at least 1"],
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, "Please provide an event category"],
      enum: [
        "Workshop",
        "Conference",
        "Seminar",
        "Meetup",
        "Training",
        "Other",
      ],
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/300x200?text=Event+Image",
    },
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"],
      default: "Upcoming",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Event", eventSchema);
