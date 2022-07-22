import { body } from "express-validator";

export const eventValidation = [
  body("title")
    .notEmpty()
    .withMessage("title is required")
    .isString()
    .isLength({ max: 100 }),
  body("venue").notEmpty().withMessage("venue is required").isString(),
  body("date").notEmpty().withMessage("date is required").isString(),
  body("time").notEmpty().withMessage("time is required").isString(),
  body("description")
    .notEmpty()
    .withMessage("description is required")
    .isString(),
  body("isActive").notEmpty().withMessage("isActive is required").isBoolean(),
];
