import { Request, Response } from "express";
import { createUser, getUser } from "../db/models/users";
import { signToken } from "../lib/jwt";
import { hashPassword } from "../lib/passwordHashing";
import { validateNewUserPayload } from "../lib/userValidation";

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

    console.log({ newUser });

    if (newUser.user) {
      const token = signToken(newUser.user.email);

      console.log({ token });

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
    console.error({ error });
    res.status(500).json({
      status: "failed",
      message: "An unknown error occurred",
    });
  }
};
