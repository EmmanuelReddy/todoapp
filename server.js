
import dotenv from "dotenv";
dotenv.config();
import express from "express";

import cors from "cors";
import mongoose from "mongoose";



const app = express();

// Middleware
app.use(cors());
    // Enable CORS with environment-based origin restriction
    app.use(cors({
      origin: process.env.CLIENT_URL,
      credentials: true
    }));
app.use(express.json());

// Auth routes
import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);

// Task routes
import taskRoutes from "./routes/taskRoutes.js";
app.use("/api/tasks", taskRoutes);

// Dashboard routes
import dashboardRoutes from "./routes/dashboardRoutes.js";
app.use("/api/dashboard", dashboardRoutes);

// Protected test route
import protect from "./middleware/authMiddleware.js";
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});

// Test route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// MongoDB Connection
import startReminderJob from "./utils/reminderJob.js";

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    startReminderJob();
  })
  .catch(err => console.log(err));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
