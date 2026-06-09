import express from 'express';
import dotenv from 'dotenv'
import { connectToDb } from './config/db.js';

dotenv.config();

const app = express();

app.use(express.json())

app.get('/',(req,res) => {
    res.send("Hello world ")
})

connectToDb();

app.listen(5000, () => console.log("Server is running on port 3000"));