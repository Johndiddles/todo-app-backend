import { Request, Response, Router } from "express";
import { registerUserController } from "../controllers/usersController";
const authRouter = Router();

authRouter.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log({ email, password });
  res.status(200).json({
    message: "success",
    user: {
      email,
    },
  });
});

authRouter.post("/register", registerUserController);

export default authRouter;
