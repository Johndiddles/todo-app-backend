import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { listTasksController } from "../controllers/tasks/listTasks.controller";
import { getTaskByIdController } from "../controllers/tasks/getTaskById.controller";
import { createTaskController } from "../controllers/tasks/createTask.controller";
import { updateTaskController } from "../controllers/tasks/updateTask.controller";
import { deleteTaskController } from "../controllers/tasks/deleteTask.controller";
import { shareTaskController } from "../controllers/tasks/shareTask.controller";
const taskRouter = Router();

taskRouter.use(authMiddleware);

taskRouter.get("/", listTasksController);
taskRouter.get("/:id", getTaskByIdController);
taskRouter.post("/", createTaskController);
taskRouter.put("/:id", updateTaskController);
taskRouter.post("/share", shareTaskController);
taskRouter.delete("/:id", deleteTaskController);

export default taskRouter;
