import { Router, Request, Response } from "express";
import { signupController } from "../controllers/signupController";
import { signinController } from "../controllers/signinController";
import { getUserInfo } from "../controllers/getUserInfo";
const router = Router();

router.post("/signup", (req: Request, res: Response) => {
  signupController(req,res)
});

router.post("/signin", (req: Request, res: Response) => {
  signinController(req,res)
});

router.get("/userInfo/:userId", (req: Request, res: Response) => {
  getUserInfo(req,res)
});


export { router as userRouter };
