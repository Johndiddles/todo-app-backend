import { Router } from "express";
import {
  createTaskController,
  getTaskByIdController,
  listTasksController,
} from "../controllers/tasksController";
const taskRouter = Router();

taskRouter.get("/", listTasksController);
taskRouter.get("/:id", getTaskByIdController);
taskRouter.post("/", createTaskController);

export default taskRouter;
