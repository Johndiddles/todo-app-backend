import { Request, Response } from "express";
import { createUser, getUser } from "../db/models/users";

export const registerUserController = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    const existingEmail = await getUser({ email: email });
    if (existingEmail.user) {
      res.status(400).json({
        status: "error",
        message: "Email already registered",
      });
      return;
    }

    const existingUsername = await getUser({ username: username });
    if (existingUsername.user) {
      res.status(400).json({
        status: "error",
        message: "Username already taken",
      });
      return;
    }

    const newUser = await createUser({
      email,
      username,
      password,
    });
    if (newUser.user) {
      res.status(201).json({
        status: "success",
        message: "Created new user successfully",
        user: newUser.user,
      });
    } else if (newUser.error) {
      if (newUser.errorType === "ValidationError") {
        res.status(400).json({
          status: "failed",
          error: newUser.error,
        });
      }
    }
  } catch (error) {
    console.error({ error });
    res.status(500).json({
      status: "failed",
      message: "An unknown error occurred",
    });
  }
};
