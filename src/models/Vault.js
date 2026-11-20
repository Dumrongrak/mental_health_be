import mongoose from "mongoose";

const vaultSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true},
        text: { type: String, required: true, trim: true},
        startDate: { type: Date, default: Date.now},
        endDate: { type: Date, default: null}
    },
    {
        timestamps: true
    }
);

export const Vault = mongoose.model("Vault", vaultSchema);