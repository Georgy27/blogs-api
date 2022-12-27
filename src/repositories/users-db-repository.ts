import { UsersDBModel } from "../models/users-model/UsersDBModel";
import { postsCollection, usersCollection } from "./db";
import { UsersDBViewModel } from "../models/users-model/UsersDBViewModel";
import { UserAccountDBModel } from "../models/users-model/UserAccountDBModel";
import { randomUUID } from "crypto";

export const usersRepository = {
  async createUser(user: UserAccountDBModel): Promise<UserAccountDBModel> {
    await usersCollection.insertOne({ ...user });
    return user;
  },
  async createUserByAdmin(user: UserAccountDBModel): Promise<UsersDBViewModel> {
    await usersCollection.insertOne({ ...user });
    return {
      id: user.id,
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt,
    };
  },
  async deleteUser(id: string) {
    const result = await usersCollection.deleteOne({ id });
    return result.deletedCount === 1;
  },

  async updateConfirmation(id: string): Promise<boolean> {
    const updatedUser = await usersCollection.updateOne(
      { id },
      { $set: { "emailConfirmation.isConfirmed": true } }
    );
    return updatedUser.modifiedCount === 1;
  },
  async updateConfirmationCode(id: string): Promise<UserAccountDBModel | null> {
    const updatedUser = await usersCollection.findOneAndUpdate(
      { id },
      {
        $set: { "emailConfirmation.confirmationCode": randomUUID() },
      },

      { returnDocument: "after" }
    );
    if (updatedUser.ok !== 1) return null;
    return updatedUser.value;
  },
  async clearUsers() {
    await usersCollection.deleteMany({});
  },
};
