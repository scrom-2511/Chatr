import { Request, Response } from "express";
import { Group } from "../model/groupModel";
export const getAllGroupsByIdController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const groups = await Group.find({ groupMembers: userId }).select("_id groupName groupMembers grpProfilePic");
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};