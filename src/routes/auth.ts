import { Request, Response, Router, NextFunction } from "express";
import { RequestWithBody } from "../types";
import { AuthUserModel } from "../models/auth-model/AuthUserModel";
import { passwordValidation } from "../middlewares/users-middleware/passwordValidation";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { usersService } from "../domain/users-service";
import { jwtService } from "../application/jwt-service";
import { jwtAuthMiddleware } from "../middlewares/jwt-auth-middleware";
import { AuthRegistrationModel } from "../models/auth-model/AuthRegistrationModel";
import { loginValidation } from "../middlewares/users-middleware/loginValidation";
import { emailValidation } from "../middlewares/users-middleware/emailValidation";
import { loginOrEmailValidation } from "../middlewares/auth-middleware/loginOrEmailValidation";
import { morgan } from "../middlewares/morgan-middleware";
export const authRouter = Router({});

authRouter.post(
  "/login",
  loginOrEmailValidation,
  passwordValidation,
  inputValidationMiddleware,
  morgan("tiny"),
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
authRouter.post(
  "/registration",
  loginValidation,
  passwordValidation,
  emailValidation,
  inputValidationMiddleware,
  morgan("tiny"),
  async (req: RequestWithBody<AuthRegistrationModel>, res: Response) => {
    //  if the user with the given email or login already exists
    const { login, password, email } = req.body;
    const newUser = await usersService.createUser(login, password, email);
    if (!newUser) return res.sendStatus(400);
    return res.sendStatus(204);
  }
);
authRouter.post(
  "/registration-confirmation",
  morgan("tiny"),
  async (req: RequestWithBody<{ code: string }>, res: Response) => {
    console.log("hello there");
  }
);
authRouter.get(
  "/me",
  jwtAuthMiddleware,
  morgan("tiny"),
  async (req: Request, res: Response) => {
    const user = await req.user;
    return res.status(200).send(user);
  }
);
