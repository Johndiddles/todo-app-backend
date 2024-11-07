import { Request as DefaultRequest } from "express";
export interface Request extends DefaultRequest {
  user?: { email: string; id: string };
}
