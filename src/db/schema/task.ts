import { model, Schema } from "mongoose";
import { validateEmail } from "../../lib/utils";
import { title } from "process";

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
      required: true,
    },
    priority: {
      type: String,
      required: true,
      enum: {
        values: ["low", "medium", "high"],
        message: "{VALUE} is not a valid priority type.",
      },
    },
    assignedTo: {
      type: String,
      required: false,
      validate: {
        validator: (email: string) => (!email ? true : validateEmail(email)),
        message: (props: { value: string[] }) =>
          `${props.value} is not a valid email address!`,
      },
      default: undefined,
    },
    sharedWith: {
      type: [String],
      required: false,
      validate: {
        validator: (emails: string[]) =>
          !emails ? true : emails.every((email) => validateEmail(email)),
        message: (props: { value: string[] }) => {
          const invalidEmails = props.value.filter(
            (email) => !validateEmail(email)
          );

          return invalidEmails?.length > 1
            ? `[${invalidEmails.join(", ")}] are not valid email addresses`
            : `${invalidEmails[0]} is not a valid email address`;
        },
      },
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

TaskSchema.index({ dueDate: 1, status: 1 });
export const Task = model("Task", TaskSchema);
