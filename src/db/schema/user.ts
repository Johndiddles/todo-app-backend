import mongoose, { model, Schema, Document, FilterQuery } from "mongoose";

interface UserDocument extends Document {
  email: string;
  username: string;
  password: string;
}

const UserSchema: Schema<UserDocument> = new Schema(
  {
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
      sparse: true,
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
