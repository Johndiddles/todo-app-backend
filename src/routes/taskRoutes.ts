import { Router } from "express";
import {
  createTaskController,
  getTaskByIdController,
  listTasksController,
  updateTaskController,
} from "../controllers/tasksController";
const taskRouter = Router();

taskRouter.get("/", listTasksController);
taskRouter.get("/:id", getTaskByIdController);
taskRouter.post("/", createTaskController);
taskRouter.put("/:id", updateTaskController);

export default taskRouter;
