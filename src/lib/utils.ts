import { Error } from "mongoose";
import { ITask } from "../types/task";

export const cleanTask: (task: any) => ITask = (task) => ({
  title: task.title,
  description: task.description,
  dueDate: task.dueDate,
  status: task.status,
  priority: task.priority,
  createdBy: task.createdBy,
  assignedTo: task.assignedTo,
  tags: task.tags,
  sharedWith: task.sharedWith,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

export const handleTasksDBError = (error: Error.ValidationError) =>
  Object.keys(error.errors).map((item) => ({
    field: item,
    message: error.errors[item].message,
  }));
