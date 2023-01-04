import { body } from "express-validator";

export const descriptionValidation = body("description")
  .isString()
  .trim()
  .notEmpty()
  .isLength({ max: 500 });
