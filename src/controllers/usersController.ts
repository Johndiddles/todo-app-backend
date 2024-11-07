import { Request, Response } from "express";
import { createUser, getUser } from "../db/models/users";
import { signToken } from "../lib/jwt";
import { comparePassword, hashPassword } from "../lib/passwordHashing";
import {
  validateNewUserPayload,
  validateUserLoginPayload,
} from "../lib/userValidation";
import { cleanUser } from "../lib/utils";

export const registerUserController = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    const validationStatus = await validateNewUserPayload({
      email,
      username,
      password,
    });
    if (validationStatus.status === "error") {
      res.status(400).json(validationStatus);
      return;
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await createUser({
      email,
      username,
      password: hashedPassword,
    });

    if (newUser.user) {
      const token = signToken(newUser.user.email);

      res.status(201).json({
        status: "success",
        message: "Created new user successfully",
        user: newUser.user,
        token,
      });
    } else if (newUser.error) {
      if (newUser.errorType === "ValidationError") {
        res.status(400).json({
          status: "failed",
          error: newUser.error,
        });
      } else {
        res.status(500).json({
          status: "failed",
          error: "An unknown error occurred, please try again later.",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "An unknown error occurred",
    });
  }
};

export const userLoginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const validationStatus = await validateUserLoginPayload({
      email,
      password,
    });
    if (validationStatus.status === "error") {
      res.status(400).json(validationStatus);
      return;
    }

    const { user, error } = await getUser({ email }, [
      "email",
      "username",
      "password",
    ]);

    if (error) {
      res.status(400).json({
        status: "error",
        message: "Invalid login details",
      });
      return;
    }

    const isPasswordMatched = await comparePassword(password, user?.password!);

    if (!isPasswordMatched) {
      res.status(400).json({
        status: "error",
        message: "Invalid login details",
      });
      return;
    }

    const token = signToken(user!.email);
    res
      .status(200)
      .json({
        status: "success",
        message: "Logged in successfully",
        user: cleanUser(user),
        token,
      });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      status: "error",
      message: "An unknown error occurred.",
    });
  }
};
