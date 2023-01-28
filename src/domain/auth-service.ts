import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { UsersService } from "./users-service";
import { JwtService } from "../application/jwt-service";
import { SessionRepository } from "../repositories/sessions-db-repository";
import { UsersQueryRepository } from "../repositories/users-db-query-repository";
import { EmailsManager } from "../managers/emails-manager";
import { inject, injectable } from "inversify";

@injectable()
export class AuthService {
  constructor(
    @inject(UsersService) protected usersService: UsersService,
    @inject(JwtService) protected jwtService: JwtService,
    @inject(SessionRepository) protected sessionRepository: SessionRepository,
    @inject(UsersQueryRepository)
    protected usersQueryRepository: UsersQueryRepository,
    @inject(EmailsManager) protected emailsManager: EmailsManager
  ) {}
  async login(
    loginOrEmail: string,
    password: string,
    ip: string,
    deviceName: string
  ) {
    const user = await this.usersService.checkCredentials(
      loginOrEmail,
      password
    );
    if (!user) {
      return null;
    }

    const deviceId = randomUUID();
    const tokens = await this.jwtService.createJWT(user.id, deviceId);
    const issuedAt = await this.jwtService.getIssuedAtByRefreshToken(
      tokens.refreshToken
    );

    await this.jwtService.saveTokenToDB(
      ip,
      deviceName,
      issuedAt,
      deviceId,
      user.id
    );
    return tokens;
  }
  async refreshToken(userId: string, deviceId: string) {
    const tokens = await this.jwtService.createJWT(userId, deviceId);
    const issuedAt = await this.jwtService.getIssuedAtByRefreshToken(
      tokens.refreshToken
    );
    const updateLastActiveDate =
      await this.sessionRepository.updateLastActiveDate(deviceId, issuedAt);
    return tokens;
  }
  async passwordRecovery(email: string) {
    const user = await this.usersQueryRepository.findByLoginOrEmail(email);
    if (!user) return null;

    const updatedUser = await this.usersService.sendPasswordRecoveryCode(
      user.id
    );
    if (!updatedUser) return null;

    try {
      await this.emailsManager.sendPasswordRecoveryCode(updatedUser);
      return true;
    } catch (error) {
      return null;
    }
  }
  async newPassword(password: string, code: string) {
    // generate new password hash
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.usersService._generateHash(
      password,
      passwordSalt
    );
    // find the user
    const user =
      await this.usersQueryRepository.findUserByPasswordConfirmationCode(code);
    if (!user) return null;
    // update user password hash in db
    const updatedPasswordHash = await this.usersService.updateUserPasswordHash(
      user.id,
      passwordHash
    );
    if (!updatedPasswordHash) return null;
    // set recoveryCode and expirationCode to null
    return await this.usersService.clearConfirmationCode(user.id);
  }
  async confirmEmail(code: string): Promise<boolean> {
    const user =
      await this.usersQueryRepository.findUserByEmailConfirmationCode(code);
    if (!user) return false;
    const updatedConfirmation = await this.usersService.updateConfirmation(
      user.id
    );
    return updatedConfirmation;
  }
  async resendEmail(email: string) {
    const user = await this.usersQueryRepository.findByLoginOrEmail(email);
    if (!user) return false;
    const updatedConfirmationCode =
      await this.usersService.updateConfirmationCode(user.id);
    if (!updatedConfirmationCode) return false;
    try {
      await this.emailsManager.sendEmailConformationMessage(
        updatedConfirmationCode
      );
    } catch (error) {
      console.log(error);
      // await usersRepository.deleteUser(user.id);
      return null;
    }
    return true;
  }
}
