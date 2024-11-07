import { Response } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  updateTask,
} from "../db/models/tasks";
import mongoose from "mongoose";

import { Request } from "../types/express";

export const listTasksController = async (req: Request, res: Response) => {
  const { id } = req.user!;

  const tasks = await listTasks(id);

  res.status(200).json({
    message: "success",
    tasks: tasks,
  });
};

export const getTaskByIdController = async (req: Request, res: Response) => {
  const { id: userId, email } = req.user!;
  const { id } = req.params;
  if (mongoose.isValidObjectId(id)) {
    const task = await getTaskById(id as string);

    if (!task.task) {
      res.status(404).json({ message: task.error });
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
    } else {
      res.status(403).json({ status: "error", message: "Forbidden" });
    }
  } else {
    res.status(400).json({ message: "not a valid id" });
  }
};

export const createTaskController = async (req: Request, res: Response) => {
  try {
    const { title, description, dueDate, status } = req.body;
    const user = req.user;

    const newTask = await createTask({
      title,
      description,
      dueDate,
      status,
      createdBy: user!.id,
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
