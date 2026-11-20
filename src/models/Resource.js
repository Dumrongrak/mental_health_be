import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
    {
        title: {type: String, required: true, trim: true},
        category: {type: String, required: true, trim: true},
        contentUrl: {type: String, required: true, trim: true},
        durationMin: {type: Number, default: 0, min: 0},
        status: {type: String, default: "active"},
    },
    { timestamps: true }
);

export const Resource = mongoose.model("Resource", resourceSchema);