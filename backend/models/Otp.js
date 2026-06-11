import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        default: "seeker"
    },

    otp: {
        type: String,
        required: true
    },

    expiresAt: {
        type: Date,
        required: true
    },

    lastSentAt: {
    type: Date,
    default: Date.now
}

}, {
    timestamps: true
});

// Automatically delete expired OTP documents
otpSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;