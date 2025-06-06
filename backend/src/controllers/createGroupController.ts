import { Request, Response } from "express";
import { Group } from "../model/groupModel";
import { groupType } from "../types/groupType";
import forge from "node-forge";
import {
  encryptSymmetricKey,
  generateSymmetricKey,
} from "./generateKeyController";
export const createGroupController = async (req: Request, res: Response) => {
  try {
    const { groupName, groupMembers, publicKey } = req.body;

    const validateData = groupType.safeParse({
      groupName,
      groupMembers,
      publicKey,
    });

    if (!validateData.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
      });
    }
    const symmetricKey = generateSymmetricKey();
    const allMembersEncryptedGroupKeys = new Map<string, string>();

    while (allMembersEncryptedGroupKeys.size < groupMembers.length) {
      allMembersEncryptedGroupKeys.set(
        groupMembers[allMembersEncryptedGroupKeys.size],
        encryptSymmetricKey(
          symmetricKey,
          publicKey[allMembersEncryptedGroupKeys.size]
        )
      );
    }

    const newGroup = await Group.create({
      ...validateData.data,
      allMembersEncryptedGroupKeys,
    });

    res.status(201).json({
      success: true,
      message: "Group created successfully",
      newGroup,
    });
  } catch (error) {
    console.error("Error in createGroupController:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating group",
    });
  }
};
