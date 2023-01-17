import { randomUUID } from "crypto";
import { UserAccountDBModel, UsersViewModel } from "../models/users-model";
import { UsersModel } from "../models/users-model/user-schema";

export const usersRepository = {
  async createUser(user: UserAccountDBModel): Promise<UserAccountDBModel> {
    await UsersModel.create({ ...user });
    return user;
  },
  async createUserByAdmin(user: UserAccountDBModel): Promise<UsersViewModel> {
    await UsersModel.create({ ...user });
    return {
      id: user.id,
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt,
    };
  },
  async deleteUser(id: string) {
    const result = await UsersModel.deleteOne({ id });
    return result.deletedCount === 1;
  },

  async updateConfirmation(id: string): Promise<boolean> {
    const updatedUser = await UsersModel.updateOne(
      { id },
      { "emailConfirmation.isConfirmed": true }
    );
    return updatedUser.modifiedCount === 1;
  },
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
  },
  async clearUsers() {
    await UsersModel.deleteMany({});
  },
};
