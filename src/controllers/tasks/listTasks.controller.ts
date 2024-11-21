import { Response } from "express";
import { Request } from "../../types/express";
import { listTasks } from "../../db/models/tasks";
import { buildTaskFilterType } from "../../lib/buildFilters";

export const listTasksController = async (req: Request, res: Response) => {
  const { id } = req.user!;

  const tasks = await listTasks(id, req.query as buildTaskFilterType);

  res.status(200).json({
    message: "success",
    ...tasks,
  });
};
