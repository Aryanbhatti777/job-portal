import mongoose from 'mongoose'
import dotenv from "dotenv";
import config from './env.config.js';
dotenv.config();

export const connectToDb = async () => {
    console.log(config.MONGO_URI)
    try {
        await mongoose.connect(config.MONGO_URI.toString())
        console.log("Connected to database")
    } catch (error) {
        console.log("Error occured connecting to database", error)
        process.exit(1)
    }
}