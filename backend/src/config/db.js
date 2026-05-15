import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_ATLAS_URI;

    if (!mongoURI) {
      throw new Error(
        "Missing MongoDB connection string. Set MONGODB_URI in backend/.env",
      );
    }

    await mongoose.connect(mongoURI, {
      dbName: process.env.MONGODB_DB_NAME,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
