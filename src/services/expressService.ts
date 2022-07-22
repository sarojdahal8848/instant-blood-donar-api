import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import createError from "http-errors";
import { NODE_ENV, port } from "../config";
import { route } from "../routes";

const server = async (app: Application) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static("uploads"));

  if (NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  app.use("/", route);

  app.use((req: Request, res: Response, next: NextFunction) =>
    next(new createError.NotFound())
  );

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).send({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    });
  });

  app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
  });

  return app;
};

export { server };
