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
      return cleanTask(task);
    } else throw new Error("Can't find task");
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
