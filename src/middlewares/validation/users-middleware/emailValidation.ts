import { body } from "express-validator";

export const emailValidation = body("email")
  .isEmail()
  .notEmpty()
  .withMessage("invalid email");
