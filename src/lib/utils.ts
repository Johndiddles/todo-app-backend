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

export const cleanUser: (
  user: any,
  options?: { includePassword?: boolean }
) => IUser = (user, options) => {
  const cleanedUser: IUser = {
    id: user._id,
    email: user.email,
  };

  if (user.username) {
    cleanedUser.username = user.username;
  }

  if (user.password && options?.includePassword) {
    cleanedUser.password = user.password;
  }

  return cleanedUser;
};

export const handleDBValidationError = (error: Error.ValidationError) =>
  Object.keys(error.errors).map((item) => ({
    field: item,
    message: error.errors[item].message,
  }));
