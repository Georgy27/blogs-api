import { UsersDBModel } from "../models/users-model/UsersDBModel";
import { usersCollection } from "./db";
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
};
