import { Request, Response } from "express";
import { Message } from "../model/messageModel";
import { CustomRequest } from "../customTypes/requestCustom";

export const sendMessageController = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  try {
    const { senderId, encryptedText, encryptedSessionKeySender, encryptedSessionKeyReceiver } = req.body;
    const recieverId = req.params.id;
    
    if (senderId === recieverId) {
      return res.status(400).json({ message: "Cannot send message to yourself", success: false });
    }
    
    // Create the message
    const newMessage = await Message.create({ 
      senderId, 
      recieverId, 
      encryptedText, 
      encryptedSessionKeySender,
      encryptedSessionKeyReceiver
    });

    // Format response data
    const data = {
      _id: newMessage._id,
      recieverId: newMessage.recieverId,
      senderId: newMessage.senderId,
      encryptedText: newMessage.encryptedText,
      encryptedSessionKeySender: newMessage.encryptedSessionKeySender,
      encryptedSessionKeyReceiver: newMessage.encryptedSessionKeyReceiver
    };
    
    return res.json({ data, success: true });
  } catch (error) {
    console.error("Error in sendMessageController:", error);
    return res.status(500).json({ message: "Server error while sending message", success: false });
  }
};
