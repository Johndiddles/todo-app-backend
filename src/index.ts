import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { dbConnect } from "./db/dbConnect";
import v1Routes from "./routes";

dotenv.config();
const PORT = process.env.PORT || 5775;

dbConnect();
const app = express();

app.use(express.json());

app.use("/v1", v1Routes);

app.get("*", (_: Request, res: Response) => {
  res.status(404).json({ status: "failed", message: "not found" });
});

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
