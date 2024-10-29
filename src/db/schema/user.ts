import { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    id: {
      type: String,
      required: [true, "Title is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    username: {
      type: String,
      required: false,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  {
    timestamps: true,
  }
);

export const User = model("User", UserSchema);
