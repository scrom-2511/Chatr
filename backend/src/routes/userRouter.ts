import { Router, Request, Response } from "express";
import { signupController } from "../controllers/signupController";
import { signinController } from "../controllers/signinController";
import { getUserInfo } from "../controllers/getUserInfo";
import { upload } from "../middleware/multer";
import { CustomRequest } from "../customTypes/requestCustom";
import { fileUpload } from "../utils/fileUpload";
import { profilePictureController } from "../controllers/profilePictureController";
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

router.post('/profileImageUpload', upload.single('profileImage'), async(req:CustomRequest, res:Response) => {
  console.log(req.body.userId)
  const result = await fileUpload(req.file?.path!, "profilePicture");
  await profilePictureController(req,res,result?.url!)
})

export { router as userRouter };
