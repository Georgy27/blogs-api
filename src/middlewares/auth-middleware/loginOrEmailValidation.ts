import { body } from "express-validator";

export const loginOrEmailValidation = body("loginOrEmail")
  .isString()
  .trim()
  .notEmpty();
