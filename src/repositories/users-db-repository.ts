import { randomUUID } from "crypto";
import { UserAccountDBModel, UsersViewModel } from "../models/users-model";
import { UsersModel } from "../models/users-model/user-schema";

export class UsersRepository {
  async createUser(user: UserAccountDBModel): Promise<UserAccountDBModel> {
    await UsersModel.create({ ...user });
    return user;
  }
  async createUserByAdmin(user: UserAccountDBModel): Promise<UsersViewModel> {
    try {
      console.log("before save");
      await UsersModel.create({ ...user });
      console.log("after save");
      return {
        id: user.id,
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt,
      };
    } catch (e) {
      console.log(e);
      return {
        id: user.id,
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt,
      };
    }
  }
  async deleteUser(id: string) {
    const result = await UsersModel.deleteOne({ id });
    return result.deletedCount === 1;
  }

  async updateConfirmation(id: string): Promise<boolean> {
    const updatedUser = await UsersModel.updateOne(
      { id },
      { "emailConfirmation.isConfirmed": true }
    );
    return updatedUser.modifiedCount === 1;
  }
  async updateConfirmationCode(id: string): Promise<UserAccountDBModel | null> {
    const updatedUser = await UsersModel.findOneAndUpdate(
      { id },
      {
        "emailConfirmation.confirmationCode": randomUUID(),
      },

      { returnDocument: "after" }
    ).lean();
    if (!updatedUser) return null;
    return updatedUser;
  }
  async updateUserPasswordHash(id: string, passwordHash: string) {
    const updatedUserHash = await UsersModel.updateOne(
      { id },
      {
        "accountData.passwordHash": passwordHash,
      }
    );
    return updatedUserHash.modifiedCount === 1;
  }
  async createPasswordRecoveryCode(
    id: string,
    passwordRecoveryInfo: { recoveryCode: string; expirationDate: string }
  ): Promise<UserAccountDBModel | null> {
    const updatedUser = UsersModel.findOneAndUpdate(
      { id },
      {
        passwordRecovery: passwordRecoveryInfo,
      },
      {
        returnDocument: "after",
      }
    ).lean();
    if (!updatedUser) return null;
    return updatedUser;
  }
  async clearConfirmationCode(
    id: string,
    passwordRecoveryInfo: { recoveryCode: null; expirationDate: null }
  ): Promise<UserAccountDBModel> {
    return UsersModel.findOneAndUpdate(
      { id },
      {
        passwordRecovery: passwordRecoveryInfo,
      }
    ).lean();
  }
  async clearUsers() {
    await UsersModel.deleteMany({});
  }
}
