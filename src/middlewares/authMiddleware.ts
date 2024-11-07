import { NextFunction, Request as DefaultRequest, Response } from "express";
import { decodeToken } from "../lib/jwt";
import { Request } from "../types/express";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ status: "error", message: "Unauthourized" });
    return;
  }

  try {
    const decodedToken = decodeToken(token);

    if (Math.floor(Date.now() / 1000) > decodedToken.exp) {
      res.status(401).json({ status: "error", message: "Unauthorized" });
      return;
    }

    req.user = { email: decodedToken.email, id: decodedToken.id };

    next();
  } catch (err) {
    console.log({ err });
    res.status(401).json({ status: "error", message: "Unauthorized" });
    return;
  }
};
