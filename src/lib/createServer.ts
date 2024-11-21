import express from "express";
import v1Routes from "../routes";

export const createServer = () => {
  const app = express();
  app.use(express.json());

  app.use("/v1", v1Routes);

  return app;
};
