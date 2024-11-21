import { Request, Response } from "express";
import dotenv from "dotenv";
import { dbConnect } from "./db/dbConnect";
import { createServer } from "./lib/createServer";

dotenv.config();
const PORT = process.env.PORT || 5775;

dbConnect();
const app = createServer();

app.get("*", (_: Request, res: Response) => {
  res.status(404).json({ status: "failed", message: "not found" });
});

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
