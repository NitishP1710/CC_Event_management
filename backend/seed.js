import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "../src/models/Event.js";
import sampleEvents from "../src/data/sampleEvents.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/event-management";
    await mongoose.connect(mongoURI);
    console.log("✓ Connected to MongoDB");

    // Clear existing events
    await Event.deleteMany({});
    console.log("✓ Cleared existing events");

    // Insert sample events
    const result = await Event.insertMany(sampleEvents);
    console.log(`✓ Inserted ${result.length} sample events`);

    // Display inserted events
    console.log("\n📋 Sample Events Inserted:");
    result.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} (ID: ${event._id})`);
    });

    console.log("\n✨ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
};

seedDatabase();
