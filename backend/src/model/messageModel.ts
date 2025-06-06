import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  recieverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  encryptedText: { type: String },
  encryptedSessionKeySender: { type: String },
  encryptedSessionKeyReceiver: { type: String }
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);

