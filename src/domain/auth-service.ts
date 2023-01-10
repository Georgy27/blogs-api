import { usersQueryRepository } from "../repositories/users-db-query-repository";
import { usersService } from "./users-service";
import { emailsManager } from "../managers/emails-manager";
import { usersRepository } from "../repositories/users-db-repository";
import { randomUUID } from "crypto";
import { jwtService } from "../application/jwt-service";
import { sessionRepository } from "../repositories/sessions-db-repository";

export const authService = {
  async login(
    loginOrEmail: string,
    password: string,
    ip: string,
    deviceName: string
  ) {
    const user = await usersService.checkCredentials(loginOrEmail, password);
    if (!user) {
      return null;
    }

    const deviceId = randomUUID();
    const tokens = await jwtService.createJWT(user.id, deviceId);
    const issuedAt = await jwtService.getIssuedAtByRefreshToken(
      tokens.refreshToken
    );

    await jwtService.saveTokenToDB(ip, deviceName, issuedAt, deviceId, user.id);
    return tokens;
  },
  async refreshToken(userId: string, deviceId: string) {
    const tokens = await jwtService.createJWT(userId, deviceId);
    const issuedAt = await jwtService.getIssuedAtByRefreshToken(
      tokens.refreshToken
    );
    const updateLastActiveDate = await sessionRepository.updateLastActiveDate(
      deviceId,
      issuedAt
    );
    return tokens;
  },
  async confirmEmail(code: string): Promise<boolean> {
    const user = await usersQueryRepository.findUserByConfirmationCode(code);
    if (!user) return false;
    const updatedConfirmation = await usersService.updateConfirmation(user.id);
    return updatedConfirmation;
  },
  async resendEmail(email: string) {
    const user = await usersQueryRepository.findByLoginOrEmail(email);
    if (!user) return false;
    const updatedConfirmationCode = await usersService.updateConfirmationCode(
      user.id
    );
    if (!updatedConfirmationCode) return false;
    try {
      await emailsManager.sendEmailConformationMessage(updatedConfirmationCode);
    } catch (error) {
      console.log(error);
      // await usersRepository.deleteUser(user.id);
      return null;
    }
    return true;
  },
};
