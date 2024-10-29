import { Request, Response, Router } from "express";
import { listTasks } from "../db/models/tasks";
import {
  createTaskController,
  listTasksController,
} from "../controllers/tasksController";
const taskRouter = Router();

taskRouter.get("/", listTasksController);
taskRouter.post("/", createTaskController);

export default taskRouter;
