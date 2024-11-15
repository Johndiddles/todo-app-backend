import { Error, ObjectId, RootFilterQuery, Types } from "mongoose";
import { Task } from "../schema/task";
import { ITask } from "../../types/task";
import { cleanTask, handleDBValidationError } from "../../lib/utils";

interface PaginationQuery {
  page?: string;
  limit?: string;
}

interface PaginatedResponse {
  tasks: ITask[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const parseQueryParams = (query: PaginationQuery) => {
  const page = Math.max(1, parseInt(query.page || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || "10", 10)));

  return { page, limit };
};

export const listTasks = async (
  userId: string,
  query: PaginationQuery
): Promise<PaginatedResponse> => {
  const { page, limit } = parseQueryParams(query);
  const skip = (page - 1) * limit;
  const filter = {
    $or: [{ createdBy: userId }, { sharedWith: { $in: [userId] } }],
  };
  const [tasks, totalCount] = await Promise.all([
    Task.find(filter).skip(skip).limit(limit).lean().exec(),
    Task.countDocuments({}),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    tasks: tasks.map((task) => cleanTask(task)) || [],
    currentPage: page,
    totalPages,
    totalItems: totalCount,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
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
