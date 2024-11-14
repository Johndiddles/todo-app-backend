import { Error as MongooseError } from "mongoose";
import { IUser } from "../../types/user";
import { User } from "../schema/user";
import { cleanUser, handleDBValidationError } from "../../lib/utils";

export const createUser = async (user: IUser) => {
  try {
    const newUser = await new User(user).save();
    return { user: cleanUser(newUser) };
  } catch (error) {
    console.log({ error });
    if (error instanceof MongooseError.ValidationError) {
      return {
        error: handleDBValidationError(error),
        errorType: "ValidationError",
      };
    }
    return { error };
  }
};

export const getUser = async (
  query: { [key: string]: string },
  returnFields?: string[]
) => {
  try {
    const user = await User.findOne(
      query,
      returnFields || ["id", "email", "username"]
    ).exec();
    if (user) {
      return { user: cleanUser(user, { includePassword: true }) };
    } else {
      return {
        error: "Can't find any match",
        errorType: "notFound",
      };
    }
  } catch (error: any) {
    console.log({ error });
    throw new Error(error);
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await User.findById(id);
    if (user) {
      return { user: cleanUser(user) };
    } else {
      return {
        error: "Can't find user with matching id",
        errorType: "notFound",
      };
    }
  } catch (error: any) {
    throw new Error(error);
  }
};
