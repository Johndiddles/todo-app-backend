import { Router } from "express";
import { userLoginController } from "../controllers/users/userLogin.controller";
import { registerUserController } from "../controllers/users/registerUser.controller";
const authRouter = Router();

authRouter.post("/login", userLoginController);

authRouter.post("/register", registerUserController);

export default authRouter;
