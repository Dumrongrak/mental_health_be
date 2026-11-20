import mongoose from "mongoose";

export async function connectDB(mongoUri) {
    if (!mongoUri) {
        throw new Error("MONGO_URI is not defined in environment variables.");
    }

    mongoose.set("strictQuery", true);
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
}