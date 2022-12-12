import { body } from "express-validator";

export const nameValidation = body("name")
  .isString()
  .trim()
  .notEmpty()
  .isLength({ max: 15 })
  .withMessage("name can not be longer than 15 characters");
