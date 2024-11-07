import { Error, ObjectId, RootFilterQuery, Types } from "mongoose";
import { Task } from "../schema/task";
import { ITask } from "../../types/task";
import { cleanTask, handleDBValidationError } from "../../lib/utils";

export const listTasks = async (userId: string) => {
  const filter = {
    $or: [{ createdBy: userId }, { sharedWith: { $in: [userId] } }],
  };
  const tasks = await Task.find(filter);
  return tasks.map((task) => cleanTask(task)) || [];
};

export const getTask = async (query: RootFilterQuery<any>) => {
  console.log({ query });

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
        error: handleDBValidationError(error),
        errorType: "ValidationError",
      };
    }
    return { error };
  }
};

export const updateTask = async (id: string | ObjectId, task: ITask) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(id, task, {
      new: true,
      runValidators: true,
    });
    return { task: cleanTask(updatedTask) };
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      return {
        error: handleDBValidationError(error),
        errorType: "ValidationError",
      };
    }
    return { error };
  }
};

export const deleteTask = async (id: string | ObjectId) => {
  try {
    const deletedTasks = await Task.findByIdAndDelete(id);
    if (deletedTasks) {
      return { id };
    } else {
      return {
        error: "Can't find task with this id",
        errorType: "notFound",
      };
    }
  } catch (error) {
    console.log({ error });
    return { error };
  }
};
