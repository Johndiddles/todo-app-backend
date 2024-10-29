import { Request, Response } from "express";
import { createTask, listTasks } from "../db/models/tasks";
import { Error } from "mongoose";

export const listTasksController = async (req: Request, res: Response) => {
  const tasks = await listTasks();
  res.status(200).json({
    message: "success",
    tasks: tasks,
  });
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
