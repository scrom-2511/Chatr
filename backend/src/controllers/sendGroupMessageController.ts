import { Request, Response } from "express";
import { groupMessageType } from "../types/groupMessageType";
import { GroupMessage } from "../model/groupMessageModel";
export const sendGroupMessageController = async (req: Request, res: Response) => {
  try {
    const validateData = groupMessageType.safeParse(req.body);

    if (!validateData.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
      });
    }

    const newGroupMessage = await GroupMessage.create(req.body);

    res.status(201).json({
      success: true,
      message: "Group message sent successfully",
      newGroupMessage,
    });
  } catch (error) {
    console.error("Error in sendGroupMessageController:", error);
    res.status(500).json({
      success: false,
      message: "Server error while sending group message",
    });
  }
};
