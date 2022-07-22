import express from "express";
import { eventValidation, paramValidation } from "../../validator";
import { eventController } from "../controllers";
import { upload } from "../helpers";
const eventRoute = express.Router();

eventRoute.post(
  "/",
  upload.single("image"),
  eventValidation,
  eventController.create
);
eventRoute.get("/", eventController.list);
eventRoute.get("/:id", paramValidation, eventController.getById);
eventRoute.put(
  "/:id",
  upload.single("image"),
  eventValidation,
  paramValidation,
  eventController.update
);
eventRoute.delete("/:id", paramValidation, eventController.deleteById);

export { eventRoute };
