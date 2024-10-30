import { Request, Response } from "express";
import {
  createTask,
  getTaskById,
  listTasks,
  updateTask,
} from "../db/models/tasks";
import mongoose, { ObjectId } from "mongoose";

export const listTasksController = async (req: Request, res: Response) => {
  const tasks = await listTasks();
  res.status(200).json({
    message: "success",
    tasks: tasks,
  });
};

export const getTaskByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (mongoose.isValidObjectId(id)) {
    const task = await getTaskById(id as string);
    if (task.task) {
      res.status(200).json({
        message: "success",
        task,
      });
    } else if (task.error) {
      res.status(404).json({ message: task.error });
    }
  } else {
    res.status(400).json({ message: "not a valid id" });
  }
};

export const createTaskController = async (req: Request, res: Response) => {
  try {
    const { title, description, dueDate, status, createdBy } = req.body;

    const newTask = await createTask({
      title,
      description,
      dueDate,
      status,
      createdBy,
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
    if (mongoose.isValidObjectId(id)) {
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
