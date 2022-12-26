import bcrypt from "bcrypt";
import { UsersDBModel } from "../models/users-model/UsersDBModel";
import { randomUUID } from "crypto";
import { usersRepository } from "../repositories/users-db-repository";
import { UsersDBViewModel } from "../models/users-model/UsersDBViewModel";
import { UserAccountDBModel } from "../models/users-model/UserAccountDBModel";
import add from "date-fns/add";
import { emailsManager } from "../managers/emails-manager";

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
      await usersRepository.deleteUser(userResult.id);
      return null;
    }
    return userResult;
  },
  async createUserByAdmin(
    login: string,
    password: string,
    email: string
  ): Promise<UsersDBViewModel> {
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
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          minutes: 1,
        }).toISOString(),
        isConfirmed: true,
      },
    };
    return usersRepository.createUserByAdmin(newUser);
  },
  async deleteUser(id: string): Promise<boolean> {
    return usersRepository.deleteUser(id);
  },
  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) return false;
    const check = await bcrypt.compare(password, user.accountData.passwordHash);

    if (check) {
      return user;
    } else {
      return false;
    }
  },
  async _generateHash(password: string, salt: string): Promise<string> {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },
};
