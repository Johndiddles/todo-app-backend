import { Response } from "express";
import { Request } from "../../types/express";
import mongoose from "mongoose";
import { getTaskById } from "../../db/models/tasks";

export const getTaskByIdController = async (req: Request, res: Response) => {
  const { id: userId, email } = req.user!;
  const { id } = req.params;
  if (mongoose.isValidObjectId(id)) {
    const task = await getTaskById(id as string);

    if (!task.task) {
      res.status(404).json({ message: task.error });
      return;
    }

    if (
      task.task?.createdBy?.toString() === userId ||
      task.task?.assignedTo === email ||
      task.task?.sharedWith?.includes(email)
    ) {
      res.status(200).json({
        message: "success",
        task,
      });
      return;
    } else {
      res.status(403).json({ status: "error", message: "Forbidden" });
      return;
    }
  } else {
    res.status(400).json({ message: "not a valid id" });
    return;
  }
};
