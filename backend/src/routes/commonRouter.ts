import { Router, Response } from "express";
import { getLastMessageDirectController, getLastMessageGroupController, setLastMessageController } from "../controllers/lastMessageController";
import { upload } from "../middleware/multer";
import { CustomRequest } from "../customTypes/requestCustom";
import { fileUpload } from "../utils/fileUpload";
import { profilePictureControllerUser, profilePictureControllerGrp, imagesInChatController } from "../controllers/imagesController";
const router = Router();

router.get("/getLastDirectMessage", (req: CustomRequest, res: Response) => {
  getLastMessageDirectController(req, res);
});

router.get("/getLastGroupMessage", (req: CustomRequest, res: Response) => {
  getLastMessageGroupController(req, res);
});

router.post("/setLastMessage", (req: CustomRequest, res: Response) => {
  setLastMessageController(req, res);
});

router.post('/imageUpload', upload.single('image'), async(req:CustomRequest, res:Response) => {
  console.log(req.body)
  const result = await fileUpload(req.file?.path!);
  if(req.body.userId) await profilePictureControllerUser(req,res,result?.url!)
  else if(req.body.grpId) await profilePictureControllerGrp(req,res,result?.url!)
  else await imagesInChatController(req,res,result?.url!)
})

export default router;