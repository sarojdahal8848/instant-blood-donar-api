import { param } from "express-validator";

export const paramValidation = [
  param("id")
    .isString()
    .withMessage("Params should be string")
    .isLength({ max: 24, min: 24 })
    .withMessage("invalid param"),
];
