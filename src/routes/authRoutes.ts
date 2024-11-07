import { Router } from "express";
import {
  registerUserController,
  userLoginController,
} from "../controllers/usersController";
const authRouter = Router();

authRouter.post("/login", userLoginController);

authRouter.post("/register", registerUserController);

export default authRouter;
