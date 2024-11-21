import express from "express";
import v1Routes from "../routes";
import cors from "cors";

export const createServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.use("/v1", v1Routes);

  return app;
};
