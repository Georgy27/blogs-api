import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { usersRepository } from "../repositories/users-db-repository";
import add from "date-fns/add";
import { emailsManager } from "../managers/emails-manager";
import { usersQueryRepository } from "../repositories/users-db-query-repository";
import { UserAccountDBModel, UsersViewModel } from "../models/users-model";

export const usersService = {
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
    const userResult = await usersRepository.createUser(newUser);

    try {
      await emailsManager.sendEmailConformationMessage(userResult);
    } catch (error) {
      console.log(error);
      // await usersRepository.deleteUser(userResult.id);
      return null;
    }
    return userResult;
  },
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
    return usersRepository.createUserByAdmin(newUser);
  },
  async deleteUser(id: string): Promise<boolean> {
    return usersRepository.deleteUser(id);
  },
  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await usersQueryRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) return false;
    const check = await bcrypt.compare(password, user.accountData.passwordHash);

    if (check) {
      return user;
    } else {
      return false;
    }
  },
  async sendPasswordRecoveryCode(id: string) {
    const passwordRecoveryInfo = {
      recoveryCode: randomUUID(),
      expirationDate: add(new Date(), {
        minutes: 1,
      }).toISOString(),
    };
    return await usersRepository.createPasswordRecoveryCode(
      id,
      passwordRecoveryInfo
    );
  },
  async clearConfirmationCode(id: string) {
    const passwordRecoveryInfo = {
      recoveryCode: null,
      expirationDate: null,
    };
    return await usersRepository.clearConfirmationCode(
      id,
      passwordRecoveryInfo
    );
  },
  async updateUserPasswordHash(id: string, passwordHash: string) {
    return await usersRepository.updateUserPasswordHash(id, passwordHash);
  },
  async updateConfirmation(id: string) {
    return await usersRepository.updateConfirmation(id);
  },
  async updateConfirmationCode(id: string) {
    return await usersRepository.updateConfirmationCode(id);
  },
  async _generateHash(password: string, salt: string): Promise<string> {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },
};
