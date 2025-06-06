import { Router, Response } from "express";
import { getLastMessageDirectController, getLastMessageGroupController, setLastMessageController } from "../controllers/lastMessageController";
import { CustomRequest } from "../customTypes/requestCustom";
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

export default router;