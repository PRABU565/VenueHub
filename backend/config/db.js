const mongoose = require("mongoose");

let isConnected = false;
let useMemoryDb = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/venuehub";
  
  console.log("Connecting to database...");
  try {
    // Attempt Mongoose connection with a short timeout to prevent hanging on startup if MongoDB is missing
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    useMemoryDb = false;
    global.dbMode = "mongodb";
    console.log("MongoDB connected successfully at:", mongoURI);
  } catch (error) {
    console.error("MongoDB Connection Failed! Error:", error.message);
    console.warn("⚠️ FALLING BACK TO HIGH-FIDELITY IN-MEMORY DATABASE MODE.");
    console.warn("⚠️ Note: Data will persist only while the server is running.");
    useMemoryDb = true;
    isConnected = false;
    global.dbMode = "memory";
    global.memoryDb = {
      User: [],
      Venue: [],
      Booking: [],
      Review: []
    };
  }
};

module.exports = { connectDB, isConnected, useMemoryDb };
