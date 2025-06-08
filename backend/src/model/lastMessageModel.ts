import mongoose from "mongoose";

const lastMessageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    recieverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    isGroupMessage: { type: Boolean, default: false },
    isImage: {type: Boolean, default: false},
    encryptedText: { type: String },
    encryptedSessionKeySender: { type: String },
    encryptedSessionKeyReceiver: { type: String }
  }, { timestamps: true });

export const LastMessage = mongoose.model("LastMessage", lastMessageSchema);