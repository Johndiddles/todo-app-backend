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
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: false,
      unique: true,
      minlength: [2, "Username must be at least 2 characters long"],
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
