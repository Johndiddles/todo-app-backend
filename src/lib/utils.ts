import { Error } from "mongoose";
import { ITask } from "../types/task";
import { IUser } from "../types/user";

export const cleanTask: (task: any) => ITask = (task) => ({
  id: task._id,
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

export const cleanUser: (user: any) => IUser = (user) => ({
  id: user._id,
  email: user.email,
  username: user.username || "",
});

export const handleDBValidationError = (error: Error.ValidationError) =>
  Object.keys(error.errors).map((item) => ({
    field: item,
    message: error.errors[item].message,
  }));
