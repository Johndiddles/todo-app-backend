import { Response } from "express";
import { Request } from "../../types/express";
import mongoose from "mongoose";
import { getTaskById, updateTask } from "../../db/models/tasks";

export const updateTaskController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { id: userId, email } = req.user!;

    if (mongoose.isValidObjectId(id)) {
      const task = await getTaskById(id as string);

      if (!task.task) {
        res.status(404).json({ message: task.error });
      }

      if (
        task.task?.createdBy?.toString() === userId ||
        task?.task?.assignedTo === email
      ) {
        const payload = req.body;

        const updatedTask = await updateTask(id, payload);
        if (updatedTask.task) {
          res.status(201).json({
            status: "success",
            message: "Updated task successfully",
            task: updatedTask.task,
          });
        } else if (updatedTask.error) {
          if (updatedTask.errorType === "ValidationError") {
            res.status(400).json({
              status: "failed",
              error: updatedTask.error,
            });
          }
        }
      } else {
        res.status(403).json({
          status: "error",
          message: "User is not authorized to update this task.",
        });
      }
    } else {
      res.status(400).json({ message: "not a valid id" });
    }
  } catch (error) {
    console.error({ error });
    res.status(500).json({
      status: "failed",
      message: "An unknown error occurred",
      error,
    });
  }
};
