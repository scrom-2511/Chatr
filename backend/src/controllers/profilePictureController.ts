import { Response } from "express";
import { CustomRequest } from "../customTypes/requestCustom";
import { User } from "../model/userModel";
import { Group } from "../model/groupModel";

export const profilePictureControllerUser = async (
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

export const profilePictureControllerGrp = async (
  req: CustomRequest,
  res: Response,
  url: string
):Promise<Response> => {
  try {
    const grpId = req.body.grpId;
    const grp = await Group.findByIdAndUpdate(grpId, {grpProfilePic:url});
    console.log("yoo")
    return res.json({message:"image upload successfull"});
  } catch (error) {
    console.log(error)
    return res.json({message:"image upload failed"})
  }
};