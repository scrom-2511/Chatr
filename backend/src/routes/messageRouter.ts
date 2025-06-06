import { Router, Request, Response } from "express";
import { sendMessageController } from "../controllers/sendMessageController";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { getAllMessagesController } from "../controllers/getAllMessagesController";
import { getAllUsersController } from "../controllers/getAllUsersController";

const router = Router();

router.post(
  "/sendMessage/:id",
  isAuthenticated,
  (req: Request, res: Response) => {
    sendMessageController(req, res);
  }
);

router.get(
  "/allMessage/:id",
  isAuthenticated,
  (req: Request, res: Response) => {
    getAllMessagesController(req, res);
  }
);

router.get("/allUsers", isAuthenticated, (req: Request, res: Response) => {
  getAllUsersController(req, res);
});
export { router as messageRouter };