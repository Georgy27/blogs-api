import { body } from "express-validator";

export const titleValidation = body("title")
  .isString()
  .trim()
  .notEmpty()
  .isLength({ max: 30 });
