import { Router, Request, Response } from "express";
import { createGroupController } from "../controllers/createGroupController";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { sendGroupMessageController } from "../controllers/sendGroupMessageController";
import { getAllGroupMessagesController } from "../controllers/getAllGroupMessagesController";
const router = Router();

router.post("/createGroup", (req: Request, res: Response) => {
  createGroupController(req, res);
});

router.post("/sendGroupMessage/:groupId", isAuthenticated, (req: Request, res: Response) => {
  sendGroupMessageController(req, res);
});

router.get("/getAllGroupMessages/:groupId",  (req: Request, res: Response) => {
  getAllGroupMessagesController(req, res);
});


export default router;
