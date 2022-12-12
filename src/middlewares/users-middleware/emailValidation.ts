import { body } from "express-validator";

export const emailValidation = body("email")
  .isString()
  .trim()
  .notEmpty()
  .matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$\n");
