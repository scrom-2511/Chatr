import { Message } from "../model/messageModel";
import { Response } from "express";
import { CustomRequest } from "../customTypes/requestCustom";
import { GroupMessage } from "../model/groupMessageModel";
import { Group } from "../model/groupModel";
export const getAllGroupMessagesController = async (req: CustomRequest, res: Response) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.query;
    const messages = await GroupMessage.find({ groupId }).sort({ createdAt: -1 });
    const group = await Group.findById(groupId);
    const encryptedEncryptionKey = group?.allMembersEncryptedGroupKeys.get(userId as string);
    return res.status(200).json({ messages, encryptedEncryptionKey });
  } catch (error) {
    res.status(500).json({ message: "Error fetching group messages" });
  }
};