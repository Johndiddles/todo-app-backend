import { Error, RootFilterQuery } from "mongoose";
import { Task } from "../schema/task";
import { ITask } from "../../types/task";
import { cleanTask, handleTasksDBError } from "../../lib/utils";

export const listTasks = async () => {
  const tasks = await Task.find();
  return tasks.map((task) => cleanTask(task)) || [];
};

export const getTask = async (query: RootFilterQuery<any>) => {
  try {
    const task = await Task.findOne(query);
    if (task) {
      return { task: cleanTask(task) };
    } else {
      return {
        error: "Can't find any match",
        errorType: "notFound",
      };
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getTaskById = async (id: string) => {
  try {
    const task = await Task.findById(id);
    if (task) {
      return { task: cleanTask(task) };
    } else {
      return {
        error: "Can't find task with matching id",
        errorType: "notFound",
      };
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

export const createTask = async (task: ITask) => {
  try {
    const newTask = new Task(task);
    const savedTask = await newTask.save();
    return { task: cleanTask(savedTask) };
  } catch (error: any) {
    if (error instanceof Error.ValidationError) {
      return {
        error: handleTasksDBError(error),
        errorType: "ValidationError",
      };
    }
    return { error };
  }
};
