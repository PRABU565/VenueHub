const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/db");
const seedDatabase = require("./config/seed");

// Import route modules
const authRoutes = require("./routes/authRoutes");
const venueRoutes = require("./routes/venueRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Middleware to ensure DB connection in serverless environment
app.use(async (req, res, next) => {
  if (!global.dbMode) {
    await connectDB();
    if (global.dbMode === "memory" && global.memoryDb.Venue.length === 0) {
      await seedDatabase();
    }
  }
  next();
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", database: global.dbMode, time: new Date() });
});

const PORT = process.env.PORT || 5000;

// Start Server locally if not in Vercel
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const startServer = async () => {
    try {
      await connectDB();
      await seedDatabase();
      
      app.listen(PORT, () => {
        console.log(`=========================================`);
        console.log(`🚀 SERVER RUNNING ON PORT: http://localhost:${PORT}`);
        console.log(`📂 DB Mode: [${global.dbMode.toUpperCase()}]`);
        console.log(`=========================================`);
      });
    } catch (error) {
      console.error("Failed to start the backend server:", error.message);
      process.exit(1);
    }
  };
  startServer();
}

module.exports = app;
