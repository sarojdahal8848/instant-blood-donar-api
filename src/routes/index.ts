import express from "express";
import { authRoute } from "./authRoute";
import { blogRoute } from "./blogRoute";
import { eventRoute } from "./eventRoute";

const route = express.Router();

route.use("/auth", authRoute);
route.use("/blog", blogRoute);
route.use("/event", eventRoute);

export { route };
