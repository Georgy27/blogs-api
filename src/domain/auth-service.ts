import { UsersDBViewModel } from "../models/users-model/UsersDBViewModel";
import bcrypt from "bcrypt";
import { UsersDBModel } from "../models/users-model/UsersDBModel";
import { randomUUID } from "crypto";
import { usersRepository } from "../repositories/users-db-repository";
import add from "date-fns/add";
import { UserAccountDBModel } from "../models/users-model/UserAccountDBModel";
import { emailsManager } from "../managers/emails-manager";
export const authService = {
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
