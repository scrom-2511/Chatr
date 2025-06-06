import { Request, Response } from "express";
import { User } from "../model/userModel";
import { Group } from "../model/groupModel";

export const getUserInfo = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId } = req.params;
    const userInfo = await User.findById(userId);
    const userGroupsInfo = await Group.find({groupMembers: userId});
    return res.status(200).json({userInfo, userGroupsInfo});
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ message: "Failed to fetch user information"});
  }
};
