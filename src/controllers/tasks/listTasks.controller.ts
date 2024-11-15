import { Response } from "express";
import { Request } from "../../types/express";
import { listTasks } from "../../db/models/tasks";

export const listTasksController = async (req: Request, res: Response) => {
  const { id } = req.user!;

  const tasks = await listTasks(id, req.query);

  res.status(200).json({
    message: "success",
    ...tasks,
  });
};
