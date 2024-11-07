import { getUser } from "../db/models/users";

export const validateNewUserPayload: (payload: {
  email: string;
  username?: string;
  password: string;
}) => Promise<{
  status: "error" | "success";
  message?: string;
}> = async (payload) => {
  const { email, username, password } = payload;

  if (!email) {
    return {
      status: "error",
      message: "Email is required",
    };
  }
  if (!password) {
    return {
      status: "error",
      message: "Password is required",
    };
  }
  const existingEmail = await getUser({ email: email });
  if (existingEmail.user) {
    return {
      status: "error",
      message: "User with this email already exists",
    };
  }

  if (username) {
    const existingUsername = await getUser({ username: username });
    if (existingUsername.user) {
      return {
        status: "error",
        message: "Username already taken",
      };
    }
  }

  return {
    status: "success",
  };
};

export const validateUserLoginPayload: (payload: {
  email: string;
  password: string;
}) => Promise<{
  status: "error" | "success";
  message?: string;
}> = async (payload) => {
  const { email, password } = payload;

  if (!email) {
    return {
      status: "error",
      message: "Email is required",
    };
  }
  if (!password) {
    return {
      status: "error",
      message: "Password is required",
    };
  }

  return {
    status: "success",
  };
};
