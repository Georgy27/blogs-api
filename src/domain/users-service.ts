import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import add from "date-fns/add";
import { UserAccountDBModel, UsersViewModel } from "../models/users-model";
import { UsersRepository } from "../repositories/users-db-repository";
import { UsersQueryRepository } from "../repositories/users-db-query-repository";
import { EmailsManager } from "../managers/emails-manager";

export class UsersService {
  constructor(
    protected usersRepository: UsersRepository,
    protected usersQueryRepository: UsersQueryRepository,
    protected emailsManager: EmailsManager
  ) {}
  async createUser(
    login: string,
    password: string,
    email: string
  ): Promise<UserAccountDBModel | null> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);
    const newUser: UserAccountDBModel = {
      id: randomUUID(),
      accountData: {
        login,
        email,
        passwordHash,
        createdAt: new Date().toISOString(),
      },
      passwordRecovery: {
        recoveryCode: null,
        expirationDate: null,
      },
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          minutes: 1,
        }).toISOString(),
        isConfirmed: false,
      },
    };
    const userResult = await this.usersRepository.createUser(newUser);

    try {
      await this.emailsManager.sendEmailConformationMessage(userResult);
    } catch (error) {
      console.log(error);
      // await usersRepository.deleteUser(userResult.id);
      return null;
    }
    return userResult;
  }
  async createUserByAdmin(
    login: string,
    password: string,
    email: string
  ): Promise<UsersViewModel> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);
    const newUser: UserAccountDBModel = {
      id: randomUUID(),
      accountData: {
        login,
        email,
        passwordHash,
        createdAt: new Date().toISOString(),
      },
      passwordRecovery: {
        recoveryCode: null,
        expirationDate: null,
      },
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          minutes: 1,
        }).toISOString(),
        isConfirmed: true,
      },
    };
    console.log(newUser);
    return this.usersRepository.createUserByAdmin(newUser);
  }
  async deleteUser(id: string): Promise<boolean> {
    return this.usersRepository.deleteUser(id);
  }
  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await this.usersQueryRepository.findByLoginOrEmail(
      loginOrEmail
    );
    if (!user) return false;
    const check = await bcrypt.compare(password, user.accountData.passwordHash);

    if (check) {
      return user;
    } else {
      return false;
    }
  }
  async sendPasswordRecoveryCode(id: string) {
    const passwordRecoveryInfo = {
      recoveryCode: randomUUID(),
      expirationDate: add(new Date(), {
        minutes: 1,
      }).toISOString(),
    };
    return await this.usersRepository.createPasswordRecoveryCode(
      id,
      passwordRecoveryInfo
    );
  }
  async clearConfirmationCode(id: string) {
    const passwordRecoveryInfo = {
      recoveryCode: null,
      expirationDate: null,
    };
    return await this.usersRepository.clearConfirmationCode(
      id,
      passwordRecoveryInfo
    );
  }
  async updateUserPasswordHash(id: string, passwordHash: string) {
    return await this.usersRepository.updateUserPasswordHash(id, passwordHash);
  }
  async updateConfirmation(id: string) {
    return await this.usersRepository.updateConfirmation(id);
  }
  async updateConfirmationCode(id: string) {
    return await this.usersRepository.updateConfirmationCode(id);
  }
  async _generateHash(password: string, salt: string): Promise<string> {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}
