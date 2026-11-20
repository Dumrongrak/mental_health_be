import mongoose from "mongoose";

const emotionalSchema = new mongoose.Schema(
    {
        emotionType: { type: String, required: true, trim: true }
    },
    { timestamps: true }
);

export const Emotional = mongoose.model("Emotional", emotionalSchema);