import { Request, Response } from "express";
import { Group } from "../model/groupModel";
import { User } from "../model/userModel";
import { encryptSymmetricKey } from "./generateKeyController";

export const leaveUserFromGroupController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { groupId, userId } = req.query;

  const group = await Group.updateOne(
    { _id: groupId },
    {
      $pull: { groupMembers: userId },
      $unset: { [`allMembersEncryptedGroupKeys.${userId}`]: "" },
    }
  );
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  return res.status(200).json({ message: "User left the group" });
};

export const addUserToGroupStep1Controller = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId, groupId } = req.body;
  const group = await Group.findById(groupId);
  const encryptedEncryptionKey = group?.allMembersEncryptedGroupKeys.get(userId);
  return res.json(encryptedEncryptionKey);
};

export const addUserToGroupFinalStepController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId, groupId, decryptedEncryptionKey } = req.body;
  const symmetricKey = decryptedEncryptionKey;
  const user = await User.findById(userId);
  const userPublicKey = user?.publicKey!;
  const encryptedEncryptionKey = encryptSymmetricKey(
    symmetricKey,
    userPublicKey
  );
  const updatedGroup = await Group.updateOne(
    { _id: groupId },
    {
      $push: { groupMembers: userId },
      $set: {
        [`allMembersEncryptedGroupKeys.${userId}`]: encryptedEncryptionKey,
      },
    }
  );

  return res.json({ message: "updated" });
};
