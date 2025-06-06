import { Response } from "express";
import { CustomRequest } from "../customTypes/requestCustom";
import { User } from "../model/userModel";

export const profilePictureController = async (
  req: CustomRequest,
  res: Response,
  url: string
):Promise<Response> => {
  try {
    const userId = req.body.userId;
    const user = await User.findByIdAndUpdate(userId, {profilePic:url});
    return res.json({message:"image upload successfull"})
  } catch (error) {
    console.log(error)
    return res.json({message:"image upload failed"})
  }
};
