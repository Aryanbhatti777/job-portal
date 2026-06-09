import mongoose from 'mongoose'


export const connectToDb = async () => {
    
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to database")
    } catch (error) {
        console.log("Error occured connecting to database", error)
        process.exit(1)
    }
}