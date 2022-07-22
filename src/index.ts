import express from "express";
import { connectDb, server } from "./services";

const startServer = async () => {
  const app = express();

  await connectDb();

  await server(app);
};

startServer();
