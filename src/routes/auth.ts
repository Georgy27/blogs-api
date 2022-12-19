import { Request, Response, Router, NextFunction } from "express";
import { RequestWithBody } from "../types";
import { AuthUserModel } from "../models/auth-model/AuthUserModel";
import { basicAuthMiddleware } from "../middlewares/basic-auth-middleware";
import { body } from "express-validator";
import { passwordValidation } from "../middlewares/users-middleware/passwordValidation";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { usersRepository } from "../repositories/users-db-repository";
import { usersService } from "../domain/users-service";
import { jwtService } from "../application/jwt-service";
import { jwtAuthMiddleware } from "../middlewares/jwt-auth-middleware";

export const authRouter = Router({});

const loginOrEmailValidation = body("loginOrEmail")
  .isString()
  .trim()
  .notEmpty();

authRouter.post(
  "/login",
  loginOrEmailValidation,
  passwordValidation,
  inputValidationMiddleware,
  async (req: RequestWithBody<AuthUserModel>, res: Response) => {
    const { loginOrEmail, password } = req.body;

    const user = await usersService.checkCredentials(loginOrEmail, password);

    if (!user) {
      return res.sendStatus(401);
    }
    const token = await jwtService.createJWT(user);
    return res.status(200).send(token);
  }
);
authRouter.get(
  "/me",
  jwtAuthMiddleware,
  async (req: Request, res: Response) => {
    const user = await req.user;
    return res.status(200).send(user);
  }
);
