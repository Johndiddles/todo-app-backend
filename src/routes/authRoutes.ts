import { Request, Response, Router } from "express";
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

export default authRouter;
