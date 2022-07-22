import express from "express";
import { blogValidation, paramValidation } from "../../validator";
import { blogController } from "../controllers";
import { upload } from "../helpers";
const blogRoute = express.Router();

blogRoute.post(
  "/",
  upload.single("image"),
  blogValidation,
  blogController.create
);
blogRoute.get("/", blogController.list);
blogRoute.get("/:id", paramValidation, blogController.getById);
blogRoute.put(
  "/:id",
  upload.single("image"),
  blogValidation,
  paramValidation,
  blogController.update
);
blogRoute.delete("/:id", paramValidation, blogController.deleteById);

export { blogRoute };
