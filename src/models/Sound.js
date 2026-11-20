import mongoose from "mongoose";

const soundSchema = new mongoose.Schema(
    {
            soundType: { type: String, required: true, trim: true },
            soundName: { type: String, required: true, trim: true }
    },
    { timestamps: true }
);

export const Sound = mongoose.model("Sound", soundSchema)