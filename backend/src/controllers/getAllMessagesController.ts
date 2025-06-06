import { Response } from "express";
import { CustomRequest } from "../customTypes/requestCustom";
import { Message } from "../model/messageModel";
import { User } from "../model/userModel";

export const getAllMessagesController = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  const recieverId = req.params.id;
  const senderId = req.senderId;
  if (!senderId) return res.json({ message: "No sender id" });
  const messages = await Message.find({
    $or: [
      { senderId: senderId, recieverId: recieverId },
      { recieverId: senderId, senderId: recieverId },
    ],
  })
    .select("_id senderId recieverId encryptedText encryptedSessionKeyReceiver encryptedSessionKeySender")
    .sort({ createdAt: -1 });
  const publicKey = await User.findById(recieverId).select("publicKey");
  if (!messages) return res.json({ message: "There are no messages" });
  console.log(messages)
  return res.json({ messages, publicKey: publicKey?.publicKey });
};
