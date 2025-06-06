import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { CustomRequest } from "../customTypes/requestCustom";
dotenv.config();
const jwt_secret = process.env.JWt_SECRET!;

export const isAuthenticated: RequestHandler = (req:CustomRequest, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: "No cookies found" });
      return;
    }

    const verify = jwt.verify(token, jwt_secret) as JwtPayload;
    req.senderId = verify.userId;
    if (!verify) {
      res.status(401).json({ message: "Login again." });
      return;
    }

    next();
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "There was some error from our side." });
  }
};
