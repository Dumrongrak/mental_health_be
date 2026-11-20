import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, "Name is required"], trim: true, maxlength: 120},
        email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true},
        passwordHash: { type: String, required: [true, "Password is required"], select: false},
        tel: { type: String, trim: true, default: ""},
        gender: { type: String, trim: true, default: ""},
        dob: { type: Date, default: null},
        imageUrl: { type: String, trim: true, default: ""},
        currentEmotionId: {type: mongoose.Schema.Types.ObjectId, ref: "Emotional", default: null}
    },
    {
        timestamps: true
    }
);

export const User = mongoose.model("User", userSchema);