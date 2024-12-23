import { FilterQuery } from "mongoose";
import { ITask } from "../types/task";

export type buildTaskFilterType = {
  startDate: string;
  endDate: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  tags?: string;
  sharedWith?: string;
};
export const buildFilter = ({
  startDate,
  endDate,
  status,
  priority,
  assignedTo,
  tags,
  sharedWith,
}: buildTaskFilterType) => {
  const filter: FilterQuery<ITask> = {};

  if (tags) {
    const tagsArray = Array.isArray(tags)
      ? (tags as string[])
      : [tags as string];

    filter.tags = { $all: tagsArray };
  }

  if (sharedWith) {
    const sharedWithArray = Array.isArray(sharedWith)
      ? (sharedWith as string[])
      : [sharedWith as string];

    filter.sharedWith = { $all: sharedWithArray };
  }

  if (startDate || endDate) {
    filter.dueDate = {};
    if (startDate) {
      filter.dueDate.$gte = new Date(startDate as string);
    }
    if (endDate) {
      filter.dueDate.$lte = new Date(endDate as string);
    }
  }
  if (priority) filter.priority = priority;
  if (status) filter.status = status;
  if (assignedTo) filter.assignedTo = assignedTo;

  return filter;
};
