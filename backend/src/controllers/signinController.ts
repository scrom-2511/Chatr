import { Request, Response } from "express";
import { signinType } from "../types/userType";
import { User } from "../model/userModel";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyPassword } from "./passwordHasherController";

dotenv.config();

const jwt_secret = process.env.JWT_SECRET!;

export const signinController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const validateData = signinType.safeParse(req.body);
  if (!validateData.success)
    return res.json({ message: "Enter the values properly." });

  const user = await User.findOne({ email: validateData.data.email });
  if (!user || !user.password)
    return res.json({ message: "There is no user with these email" });
  else if (!(await verifyPassword(validateData.data.password, user.password)))
    return res.json({ message: "Enter the correct pass!" });
  const userId = user.id;

  const userData = {
    userId,
    publicKey: user.publicKey,
    encryptedPrivateKey: user.privateKey,
    profilePic:user.profilePic
  };
  const token = jwt.sign({ userId }, jwt_secret);
  return res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
    })
    .json({ message: "signin successfull", success: true, userData });
};
