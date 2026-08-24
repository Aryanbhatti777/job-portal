import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectToDb } from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";

import { authRouter } from "./routes/authRoutes.js";
import { jobRouter } from "./routes/jobRoutes.js";
import { ApplicationRouter } from "./routes/applicationRoutes.js";
import { profileRouter } from "./routes/profileRoutes.js";
import { adminRouter } from "./routes/adminRoutes.js";

// ✅ Fix for __dirname in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(cookieParser());

// CORS (production-safe)
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL || "https://job-portal-omega-sable.vercel.app"
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

// ✅ Serve static files from React build
app.use(express.static(path.join(__dirname, "dist")));
// If using 'build' folder instead of 'dist', change above to:
// app.use(express.static(path.join(__dirname, "build")));

// ---------------- ROUTES ----------------
app.use("/api/auth", authRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/application", ApplicationRouter);
app.use("/api/profile", profileRouter);
app.use("/api/admin", adminRouter);

// ✅ CRITICAL: Fallback route for React SPA
// This must come AFTER all API routes
// Use regex /.*/ instead of "*" for newer Express versions
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
  // If using 'build' folder instead of 'dist', change above to:
  // res.sendFile(path.join(__dirname, "build", "index.html"));
});

// ✅ Error handling (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

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