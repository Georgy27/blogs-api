import { UsersDBModel } from "../models/users-model/UsersDBModel";
import { postsCollection, usersCollection } from "./db";
import { UsersDBViewModel } from "../models/users-model/UsersDBViewModel";

export const usersRepository = {
  async createUser(user: UsersDBModel): Promise<UsersDBViewModel> {
    await usersCollection.insertOne({ ...user });
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  },
  async deleteUser(id: string) {
    const result = await usersCollection.deleteOne({ id });
    return result.deletedCount === 1;
  },
  async findLoginOrEmail(loginOrEmail: string): Promise<UsersDBModel | null> {
    const user = await usersCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
    return user;
  },
  async clearUsers() {
    await usersCollection.deleteMany({});
  },
};
