import { Response } from "express";
import { Request } from "../../types/express";
import mongoose from "mongoose";
import { getTaskById, shareTask, updateTask } from "../../db/models/tasks";

export const shareTaskController = async (req: Request, res: Response) => {
  try {
    const { id: userId, email } = req.user!;
    const { email: shareWithEmail, id: task_id } = req.body;

    if (!shareWithEmail || !task_id) {
      res.status(400).json({
        status: "failed",
        message: "Email and task id are required",
      });
    }

    if (mongoose.isValidObjectId(task_id)) {
      const task = await getTaskById(task_id as string);

      if (!task.task) {
        res.status(404).json({ status: "failed", message: task.error });
        return;
      }

      if (
        task.task?.createdBy?.toString() === userId ||
        task?.task?.assignedTo === email
      ) {
        const updatedTask = await shareTask(task_id, shareWithEmail);
        if (updatedTask.task) {
          res.status(201).json({
            status: "success",
            message: "Updated task successfully",
            task: updatedTask.task,
          });
          return;
        } else if (updatedTask.error) {
          if (updatedTask.errorType === "ValidationError") {
            res.status(400).json({
              status: "failed",
              error: updatedTask.error,
            });
            return;
          }
        }
      } else {
        res.status(403).json({
          status: "error",
          message: "User is not authorized to update this task.",
        });
        return;
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
    return;
  }
};
