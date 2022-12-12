import { body } from "express-validator";

export const shortDescriptionValidation = body("shortDescription")
  .isString()
  .trim()
  .notEmpty()
  .isLength({ max: 100 });
