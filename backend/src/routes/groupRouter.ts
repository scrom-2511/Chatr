import { Router, Request, Response } from "express";
import { getAllGroupsByIdController } from "../controllers/getAllGroupsByIdController";
import { getAllGroupMembers } from "../controllers/getAllGroupMembers";
import { addUserToGroupFinalStepController, addUserToGroupStep1Controller,leaveUserFromGroupController  } from "../controllers/groupOperationsController";
const router = Router();

router.get("/getAllGroups", getAllGroupsByIdController);
router.get("/getAllGroupMembers/:groupId", (req: Request, res: Response) => {
  getAllGroupMembers(req, res);
});
router.get("/leaveGroup", (req: Request, res: Response) => {
  leaveUserFromGroupController(req, res);
});
router.post("/addGroup1", (req:Request, res: Response)=>{
  addUserToGroupStep1Controller(req,res);
})
router.post("/addGroupFinal", (req:Request, res: Response)=>{
  addUserToGroupFinalStepController(req,res);
})
export default router;
