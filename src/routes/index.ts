import { Router } from "express";
import authRouter from "./authRoutes";
import taskRouter from "./taskRoutes";

const v1Routes = Router();

v1Routes.use("/users", authRouter);
v1Routes.use("/tasks", taskRouter);

export default v1Routes;
