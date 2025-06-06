import { Request, Response } from "express";
import { Group } from "../model/groupModel";

export const getAllGroupMembers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    const members = group?.groupMembers;
    return res.status(200).json(members);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
