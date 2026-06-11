import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import { connectToDb } from './config/db.js';
import { authRouter } from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import { jobRouter } from './routes/jobRoutes.js';
import { ApplicationRouter } from './routes/applicationRoutes.js';
import { profileRouter } from './routes/profileRoutes.js';
import { connectCloudinary } from './config/cloudinary.js';
import { adminRouter } from './routes/adminRoutes.js';
import cors from "cors";




const app = express();

app.use(express.json());

app.use(cookieParser())

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use('/api/auth', authRouter);

app.use('/api/jobs', jobRouter);

app.use('/api/application/', ApplicationRouter)

app.use('/api/profile', profileRouter)

app.use('/api/admin', adminRouter)

connectToDb();

connectCloudinary();

app.listen(5000, () => console.log("Server is running on port 5000"));