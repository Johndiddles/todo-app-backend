import { Router } from "express";
import {
  createTaskController,
  deleteTaskController,
  getTaskByIdController,
  listTasksController,
  updateTaskController,
} from "../controllers/tasksController";
import { authMiddleware } from "../middlewares/authMiddleware";
const taskRouter = Router();

taskRouter.use(authMiddleware);

taskRouter.get("/", listTasksController);
taskRouter.get("/:id", getTaskByIdController);
taskRouter.post("/", createTaskController);
taskRouter.put("/:id", updateTaskController);
taskRouter.delete("/:id", deleteTaskController);

export default taskRouter;
