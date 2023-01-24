import { RequestWithBody } from "../types";
import { AuthRegistrationModel, AuthUserModel } from "../models/auth-model";
import { Request, Response } from "express";
import { AuthService } from "../domain/auth-service";
import { UsersService } from "../domain/users-service";
import { SessionRepository } from "../repositories/sessions-db-repository";

export class AuthController {
  constructor(
    protected authService: AuthService,
    protected usersService: UsersService,
    protected sessionRepository: SessionRepository
  ) {}

  async login(req: RequestWithBody<AuthUserModel>, res: Response) {
    const { loginOrEmail, password } = req.body;
    const deviceName = req.headers["user-agent"];
    if (!deviceName) return res.sendStatus(401);
    const ip = req.ip;

    const tokens = await this.authService.login(
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

  async register(req: RequestWithBody<AuthRegistrationModel>, res: Response) {
    const { login, password, email } = req.body;
    const newUser = await this.usersService.createUser(login, password, email);
    if (!newUser) return res.sendStatus(400);
    return res.sendStatus(204);
  }

  async refreshToken(req: Request, res: Response) {
    const userId = req.user!.userId;
    const deviceId = req.jwtPayload!.deviceId;
    const tokens = await this.authService.refreshToken(userId, deviceId);

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: 20000,
      httpOnly: true,
      secure: true,
    });

    return res.status(200).send({ accessToken: tokens.accessToken });
  }

  async logout(req: Request, res: Response) {
    const userId = req.user!.userId;
    const deviceId = req.jwtPayload!.deviceId;
    const removeToken = await this.sessionRepository.deleteSessionByDeviceID(
      deviceId,
      userId
    );
    if (!removeToken) return res.sendStatus(401);
    return res.clearCookie("refreshToken").status(204).send({});
  }

  async registrationConfirmation(
    req: RequestWithBody<{ code: string }>,
    res: Response
  ) {
    const code = req.body.code;
    const isConfirmedEmail = await this.authService.confirmEmail(code);
    if (!isConfirmedEmail) {
      return res.sendStatus(400);
    }
    return res.sendStatus(204);
  }

  async registrationEmailResending(
    req: RequestWithBody<{ email: string }>,
    res: Response
  ) {
    const userEmail = req.body.email;
    const result = await this.authService.resendEmail(userEmail);
    // if email could not be send (can be 500 error)
    if (!result) return res.sendStatus(400);
    return res.sendStatus(204);
  }
  async passwordRecovery(
    req: RequestWithBody<{ email: string }>,
    res: Response
  ) {
    const userEmail = req.body.email;
    await this.authService.passwordRecovery(userEmail);
    return res.sendStatus(204);
  }
  async newPassword(
    req: RequestWithBody<{ newPassword: string; recoveryCode: string }>,
    res: Response
  ) {
    const { newPassword, recoveryCode } = req.body;
    const result = await this.authService.newPassword(
      newPassword,
      recoveryCode
    );
    if (!result) return res.sendStatus(400);
    return res.sendStatus(204);
  }

  async me(req: Request, res: Response) {
    const user = await req.user;
    return res.status(200).send(user);
  }
}
