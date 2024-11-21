import { Response } from "express";
import { Request } from "../../types/express";
import { createTask } from "../../db/models/tasks";

export const createTaskController = async (req: Request, res: Response) => {
  try {
    const { title, description, dueDate, status, priority, tags } = req.body;
    const user = req.user;

    const newTask = await createTask({
      title,
      description,
      dueDate,
      status,
      priority,
      createdBy: user!.id,
      tags,
    });
    if (newTask.task) {
      res.status(201).json({
        status: "success",
        message: "Created new task successfully",
        task: newTask.task,
      });
    } else if (newTask.error) {
      if (newTask.errorType === "ValidationError") {
        res.status(400).json({
          status: "failed",
          error: newTask.error,
        });
      }
    }
  } catch (error) {
    console.error({ error });
    res.status(500).json({
      status: "failed",
      message: "An unknown error occurred",
    });
  }
};
