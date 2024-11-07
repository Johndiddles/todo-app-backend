import { Error } from "mongoose";
import { IUser } from "../../types/user";
import { User } from "../schema/user";
import { cleanUser, handleDBValidationError } from "../../lib/utils";

export const createUser = async (user: IUser) => {
  try {
    const newUser = await new User(user).save();
    return { user: cleanUser(newUser) };
  } catch (error) {
    console.log({ error });
    if (error instanceof Error.ValidationError) {
      return {
        error: handleDBValidationError(error),
        errorType: "ValidationError",
      };
    }
    return { error };
  }
};

export const getUser = () => {};
