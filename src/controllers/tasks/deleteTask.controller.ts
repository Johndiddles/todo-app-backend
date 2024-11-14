import { Response } from "express";
import { Request } from "../../types/express";
import mongoose from "mongoose";
import { deleteTask, getTaskById } from "../../db/models/tasks";

export const deleteTaskController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user!;
    if (mongoose.isValidObjectId(id)) {
      const task = await getTaskById(id as string);

      if (!task.task) {
        res.status(404).json({ message: task.error });
      }

      if (
        task.task?.createdBy === userId ||
        task?.task?.assignedTo === userId
      ) {
        const deletedTask = await deleteTask(id);
        if (deletedTask.id) {
          res.status(201).json({
            status: "success",
            message: "Deleted task successfully",
            task: deletedTask.id,
          });
        } else if (deletedTask.error) {
          if (deletedTask.errorType === "notFound") {
            res
              .status(404)
              .json({ status: "failed", message: deletedTask.error });
          } else
            res.status(400).json({
              status: "failed",
              error: deletedTask.error,
            });
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
