import { body } from "express-validator";

export const contentValidation = body("content")
  .isString()
  .trim()
  .notEmpty()
  .isLength({ max: 1000 });
