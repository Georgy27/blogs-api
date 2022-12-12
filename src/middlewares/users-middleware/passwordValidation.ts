import { body } from "express-validator";

export const passwordValidation = body("password")
  .isString()
  .trim()
  .notEmpty()
  .isLength({ min: 6, max: 20 })
  .withMessage("password should be between 6 and 20 characters");
