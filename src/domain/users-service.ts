import bcrypt from "bcrypt";
import { UsersDBModel } from "../models/users-model/UsersDBModel";
import { randomUUID } from "crypto";
import { usersRepository } from "../repositories/users-db-repository";
import { UsersDBViewModel } from "../models/users-model/UsersDBViewModel";

export const usersService = {
  async createUser(
    login: string,
    password: string,
    email: string
  ): Promise<UsersDBViewModel> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);
    const newUser: UsersDBModel = {
      id: randomUUID(),
      login: login,
      email: email,
      passwordHash: passwordHash,
      createdAt: new Date().toISOString(),
    };
    return usersRepository.createUser(newUser);
  },
  async deleteUser(id: string): Promise<boolean> {
    return usersRepository.deleteUser(id);
  },
  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await usersRepository.findLoginOrEmail(loginOrEmail);
    if (!user) return false;
    const check = await bcrypt.compare(password, user.passwordHash);

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
