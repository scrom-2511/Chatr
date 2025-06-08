import { Response } from "express";
import { CustomRequest } from "../customTypes/requestCustom";
import { User } from "../model/userModel";
import { Group } from "../model/groupModel";
import { Message } from "../model/messageModel";

export const profilePictureControllerUser = async (
  req: CustomRequest,
  res: Response,
  url: string
): Promise<Response> => {
  try {
    const userId = req.body.userId;
    const user = await User.findByIdAndUpdate(userId, { profilePic: url });
    return res.json({ message: "image upload successfull" });
  } catch (error) {
    console.log(error);
    return res.json({ message: "image upload failed" });
  }
};

export const profilePictureControllerGrp = async (
  req: CustomRequest,
  res: Response,
  url: string
): Promise<Response> => {
  try {
    const grpId = req.body.grpId;
    const grp = await Group.findByIdAndUpdate(grpId, { grpProfilePic: url });
    return res.json({ message: "image upload successfull" });
  } catch (error) {
    console.log(error);
    return res.json({ message: "image upload failed" });
  }
};

export const imagesInChatController = async (
  req: CustomRequest,
  res: Response,
  url: string
): Promise<Response> => {
  try {
    const { senderId, recieverId, encryptedSessionKeyReceiver, encryptedSessionKeySender } = req.body;
    const newImage = await Message.create({ isImage: true, encryptedText: url, senderId, recieverId, encryptedSessionKeyReceiver, encryptedSessionKeySender });
    const data = {
      _id: newImage._id,
      recieverId: newImage.recieverId,
      senderId: newImage.senderId,
      encryptedText: newImage.encryptedText,
      encryptedSessionKeySender: newImage.encryptedSessionKeySender,
      encryptedSessionKeyReceiver: newImage.encryptedSessionKeyReceiver,
      isImage:newImage.isImage
    };
    return res.json({ data, success: true })
  }
  catch (error) {
    console.log(error)
    return res.json({ message: "unsuccessfull" })
  }
};
