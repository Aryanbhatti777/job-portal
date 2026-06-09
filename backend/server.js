import express from 'express';
import dotenv from 'dotenv'
import { connectToDb } from './config/db.js';
import { authRouter } from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import { jobRouter } from './routes/jobRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cookieParser())

app.use('/api/auth', authRouter);

app.use('/api', jobRouter)

connectToDb();

app.listen(5000, () => console.log("Server is running on port 5000"));