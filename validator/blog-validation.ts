import { body } from "express-validator";

export const blogValidation = [
  body("id").optional().isString(),
  body("title")
    .notEmpty()
    .withMessage("title is required")
    .isString()
    .isLength({ max: 100 }),
  body("description")
    .notEmpty()
    .withMessage("description is required")
    .isString(),
  body("isActive").notEmpty().withMessage("isActive is required").isBoolean(),
];
