import { Response } from "express";
import { Request } from "../../types/express";
import { validateUserLoginPayload } from "../../lib/userValidation";
import { getUser } from "../../db/models/users";
import { comparePassword } from "../../lib/passwordHashing";
import { signToken } from "../../lib/jwt";
import { cleanUser } from "../../lib/utils";

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
      "_id",
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

    const token = signToken(user!.email, user!.id!);
    res.status(200).json({
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
