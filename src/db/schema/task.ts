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
      enum: {
        values: ["pending", "in-progress", "completed"],
        message: "{VALUE} is not a valid status.",
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    priority: {
      type: String,
      required: false,
      enum: {
        values: ["low", "medium", "high"],
        message: "{VALUE} is not a valid priority type.",
      },
    },
    assignedTo: {
      type: String,
      required: false,
    },
    sharedWith: {
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
