import { User } from "../model/userModel";
import { signupType } from "../types/userType";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { hashPassword } from "./passwordHasherController";
import { generateAssymetricKeyPair } from "./generateKeyController";

dotenv.config();

export const signupController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const validateData = signupType.safeParse(req.body);

    if (!validateData.success) {
      return res.status(400).json({
        message: validateData.error,
      });
    }

    const userExists = await User.findOne({ email: validateData.data.email });
    if (userExists) {
      return res.status(400).json({
        message: "An account with this email already exists!",
      });
    }

    const password = await hashPassword(validateData.data.password);
    const { publicKey, encryptedPrivateKey: privateKey } =
      generateAssymetricKeyPair(validateData.data.password);

    const { username, email, profilePic } = validateData.data;
    const newUser = await User.create({
      username,
      password,
      email,
      profilePic,
      publicKey,
      privateKey,
    });
    return res
      .status(201)
      .json({ message: "signup successfull", success: true });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
