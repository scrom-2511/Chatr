import { Response } from "express";
import { CustomRequest } from "../customTypes/requestCustom";
import { LastMessage } from "../model/lastMessageModel";
import { Group } from "../model/groupModel";

export const getLastMessageDirectController = async (
  req: CustomRequest,
  res: Response
) => {
  const { userId } = req.query;
  const lastMessages = await LastMessage.find({
    $or: [{ senderId: userId }, { recieverId: userId }],
  }).sort({ createdAt: -1 });
  return res.status(200).json(lastMessages);
};

export const getLastMessageGroupController = async (
  req: CustomRequest,
  res: Response
) => {
  const { userId } = req.query;
  const userGroups = await Group.find({
    groupMembers: userId
  });
  const groupIds = userGroups.map((group) => group.id);
  const encryptionKeyMap = new Map<string, Map<string, string>>();
  userGroups.forEach((group) => {
    encryptionKeyMap.set(group.id, group.allMembersEncryptedGroupKeys);
  });
  const lastMessages = await LastMessage.find({
    groupId: groupIds,
  }).sort({ createdAt: -1 });

  const lastMessagesWithEncryptionKey = lastMessages.map((message) => ({
    ...message.toObject(),
    encryptionKey:encryptionKeyMap.get(message.groupId?.toString()!)
  }));

  return res.status(200).json({ lastMessage: lastMessagesWithEncryptionKey });
};

export const setLastMessageController = async (
  req: CustomRequest,
  res: Response
) => {
  const { lastMessage, isGroupMessage } = req.body;

  if (!isGroupMessage) {
    const { senderId, recieverId, encryptedText,
      encryptedSessionKeySender,
      encryptedSessionKeyReceiver, } = lastMessage;
    await LastMessage.updateOne(
      {
        $or: [
          { senderId, recieverId },
          { senderId: recieverId, recieverId: senderId },
        ],
      },
      {
        $set: {
          senderId,
          recieverId,
          encryptedText,
          encryptedSessionKeySender,
          encryptedSessionKeyReceiver,
          isGroupMessage: false,
        },
      },
      { upsert: true }
    );
  } else {
    const { groupId, encryptedText } = lastMessage;
    await LastMessage.updateOne(
      { groupId },
      {
        $set: {
          encryptedText,
          isGroupMessage: true,
        },
      },
      { upsert: true }
    );
  }

  res.status(200).json({ message: "Last message set", success: true });
};
