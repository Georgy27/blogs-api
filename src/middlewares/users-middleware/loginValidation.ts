import { body } from "express-validator";

export const loginValidation = body("login")
  .isString()
  .trim()
  .notEmpty()
  .isLength({ min: 3, max: 10 })
  .matches("^[a-zA-Z0-9_-]*$")
  .withMessage("login should be between 3 and 10 characters");
