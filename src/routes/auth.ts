import { Request, Response, Router, NextFunction } from "express";
import { RequestWithBody } from "../types";
import { AuthUserModel } from "../models/auth-model/AuthUserModel";
import { passwordValidation } from "../middlewares/validation/users-middleware/passwordValidation";
import { inputValidationMiddleware } from "../middlewares/validation/input-validation-middleware";
import { usersService } from "../domain/users-service";
import { jwtAuthMiddleware } from "../middlewares/auth/jwt-auth-middleware";
import { AuthRegistrationModel } from "../models/auth-model/AuthRegistrationModel";
import { loginValidation } from "../middlewares/validation/users-middleware/loginValidation";
import { emailValidation } from "../middlewares/validation/users-middleware/emailValidation";
import { loginOrEmailValidation } from "../middlewares/validation/auth-middleware/loginOrEmailValidation";
import { morgan } from "../middlewares/morgan-middleware";
import { authService } from "../domain/auth-service";
import { confirmEmail } from "../middlewares/validation/auth-middleware/confirmEmail";
import { emailResendingValidation } from "../middlewares/validation/auth-middleware/emailResendingValidation";
import { sessionRepository } from "../repositories/sessions-db-repository";
import { refreshTokenMiddleware } from "../middlewares/auth/refresh-token-middleware";
import { checkRequests } from "../middlewares/auth/checkRequests-middleware";

export const authRouter = Router({});

authRouter.post(
  "/login",
  checkRequests,
  loginOrEmailValidation,
  passwordValidation,
  inputValidationMiddleware,
  morgan("tiny"),
  async (req: RequestWithBody<AuthUserModel>, res: Response) => {
    const { loginOrEmail, password } = req.body;
    const deviceName = req.headers["user-agent"];
    if (!deviceName) return res.sendStatus(401);
    const ip = req.ip;

    const tokens = await authService.login(
      loginOrEmail,
      password,
      ip,
      deviceName
    );
    if (!tokens) return res.sendStatus(401);

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: 20000,
      httpOnly: true,
      secure: true,
    });

    return res.status(200).send({ accessToken: tokens.accessToken });
  }
);
authRouter.post(
  "/registration",
  checkRequests,
  loginValidation,
  passwordValidation,
  emailValidation,
  inputValidationMiddleware,
  morgan("tiny"),
  async (req: RequestWithBody<AuthRegistrationModel>, res: Response) => {
    const { login, password, email } = req.body;
    const newUser = await usersService.createUser(login, password, email);
    if (!newUser) return res.sendStatus(400);
    return res.sendStatus(204);
  }
);
authRouter.post(
  "/refresh-token",
  refreshTokenMiddleware,
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const deviceId = req.jwtPayload!.deviceId;
    const tokens = await authService.refreshToken(userId, deviceId);

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: 20000,
      httpOnly: true,
      secure: true,
    });

    return res.status(200).send({ accessToken: tokens.accessToken });
  }
);
authRouter.post(
  "/logout",
  refreshTokenMiddleware,
  morgan("tiny"),
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const deviceId = req.jwtPayload!.deviceId;
    const removeToken = await sessionRepository.deleteSessionByDeviceID(
      deviceId,
      userId
    );
    if (!removeToken) return res.sendStatus(401);
    return res.clearCookie("refreshToken").status(204).send({});
  }
);
authRouter.post(
  "/registration-confirmation",
  checkRequests,
  confirmEmail,
  inputValidationMiddleware,
  morgan("tiny"),
  async (req: RequestWithBody<{ code: string }>, res: Response) => {
    const code = req.body.code;
    const isConfirmedEmail = await authService.confirmEmail(code);
    if (!isConfirmedEmail) {
      return res.sendStatus(400);
    }
    return res.sendStatus(204);
  }
);
authRouter.post(
  "/registration-email-resending",
  checkRequests,
  emailResendingValidation,
  inputValidationMiddleware,
  morgan("tiny"),
  async (req: RequestWithBody<{ email: string }>, res: Response) => {
    const userEmail = req.body.email;
    const result = await authService.resendEmail(userEmail);
    // if email could not be send (can be 500 error)
    if (!result) return res.sendStatus(400);
    return res.sendStatus(204);
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
