import { model, Schema } from "mongoose";

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["pending", "in-progress", "completed"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    priority: {
      type: String,
      required: false,
      enum: ["low", "medium", "high"],
    },
    assignedTo: {
      type: [String],
      required: false,
    },
    tags: {
      type: [String],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Task = model("Task", TaskSchema);
