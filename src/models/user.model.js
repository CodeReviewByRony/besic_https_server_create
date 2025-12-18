import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    username: { type: String, trim: true, required: true, unique: true },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, trim: true, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    gender: { type: String, enum: ["male", "female", "option"] },
    date_of_birth: { type: Date },
    sendOTP: { type: String },
    emailVerified: { type: Boolean, default: false },
    accessToken: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
