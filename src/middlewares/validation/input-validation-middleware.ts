import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const inputValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const customErrorsMessages: { message: string; field: string }[] = [];

    errors.array({ onlyFirstError: true }).forEach((err) => {
      const { value, msg, param, location } = err;
      customErrorsMessages.push({
        message: msg,
        field: param,
      });
    });

    return res.status(400).send({ errorsMessages: customErrorsMessages });
  } else {
    next();
  }
};
