import express from 'express';
import dotenv from 'dotenv'
import { connectToDb } from './config/db.js';
import { authRouter } from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cookieParser())

app.use('/api/auth', authRouter);

app.get('/',(req,res) => {
    res.send("Hello world ")
})

connectToDb();

app.listen(5000, () => console.log("Server is running on port 5000"));