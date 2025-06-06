import { CustomRequest } from "../customTypes/requestCustom";
import { Response } from "express";
import { User } from "../model/userModel";
import { Message } from "../model/messageModel";

export const getAllUsersController = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  try {
    const currentUser = req.senderId;
    const users = await User.find({_id:{$ne:currentUser}}).select("username profilePic _id publicKey");

    return res.json({ data: users, success: true });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "An error occurred while fetching users." });
  }
};
