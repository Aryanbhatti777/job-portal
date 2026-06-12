import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectToDb } from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";

import { authRouter } from "./routes/authRoutes.js";
import { jobRouter } from "./routes/jobRoutes.js";
import { ApplicationRouter } from "./routes/applicationRoutes.js";
import { profileRouter } from "./routes/profileRoutes.js";
import { adminRouter } from "./routes/adminRoutes.js";

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(cookieParser());

// CORS (production-safe)
const allowedOrigins = [
  "http://localhost:5173",
  "https://job-portal-1lzk-egw4tqsct-aryanbhatti777s-projects.vercel.app/"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

// ---------------- ROUTES ----------------
app.use("/api/auth", authRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/application", ApplicationRouter);
app.use("/api/profile", profileRouter);
app.use("/api/admin", adminRouter);

// ---------------- START SERVER SAFELY ----------------
const startServer = async () => {
  try {
    await connectToDb();
    await connectCloudinary();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
};

startServer();