import { Router } from "express";
import authRouter from "./authRoutes";

const v1Routes = Router();

v1Routes.use("/auth", authRouter);

export default v1Routes;
