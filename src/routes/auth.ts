import { Request, Response, Router, NextFunction } from "express";
import { RequestWithBody } from "../types";
import { AuthUserModel } from "../models/auth-model/AuthUserModel";
import { basicAuthMiddleware } from "../middlewares/basic-auth-middleware";
import { body } from "express-validator";
import { passwordValidation } from "../middlewares/users-middleware/passwordValidation";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { usersRepository } from "../repositories/users-db-repository";
import { usersService } from "../domain/users-service";
export const authRouter = Router({});

const loginOrEmailValidation = body("loginOrEmail")
  .isString()
  .trim()
  .notEmpty();

authRouter.post(
  "/",
  loginOrEmailValidation,
  passwordValidation,
  inputValidationMiddleware,
  async (req: RequestWithBody<AuthUserModel>, res: Response) => {
    const { loginOrEmail, password } = req.body;

    const checkUser = await usersService.checkCredentials(
      loginOrEmail,
      password
    );

    if (!checkUser) {
      return res.sendStatus(401);
    }
    return res.sendStatus(204);
  }
);
