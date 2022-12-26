import { UsersDBModel } from "../models/users-model/UsersDBModel";
import { postsCollection, usersCollection } from "./db";
import { UsersDBViewModel } from "../models/users-model/UsersDBViewModel";
import { UserAccountDBModel } from "../models/users-model/UserAccountDBModel";

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
  async findByLoginOrEmail(
    loginOrEmail: string
  ): Promise<UserAccountDBModel | null> {
    const user = await usersCollection.findOne({
      $or: [
        { "accountData.email": loginOrEmail },
        { "accountData.login": loginOrEmail },
      ],
    });
    console.log(user);
    return user;
  },
  async clearUsers() {
    await usersCollection.deleteMany({});
  },
};
