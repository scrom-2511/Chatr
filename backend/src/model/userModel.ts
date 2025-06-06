import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String },
    password: { type: String },
    email: { type: String, unique: true },
    profilePic: { type: String, default: "" },
    publicKey: { type: String },
    privateKey: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
