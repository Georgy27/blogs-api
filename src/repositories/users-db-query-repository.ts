import { UsersViewModel } from "../models/users-model/UsersViewModel";
import { blogsCollection, usersCollection } from "./db";
import { Filter } from "mongodb";
import { UsersDBModel } from "../models/users-model/UsersDBModel";
import { AuthViewModel } from "../models/auth-model/AuthViewModel";
import { Pagination } from "../models/pagination.model";

export const usersQueryRepository = {
  async findUsers(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string | undefined,
    searchLoginTerm: string | undefined | null,
    searchEmailTerm: string | undefined | null
  ): Promise<Pagination<UsersViewModel>> {
    const filter: Filter<UsersDBModel> = {
      $or: [
        { login: { $regex: searchLoginTerm ?? "", $options: "i" } },
        { email: { $regex: searchEmailTerm ?? "", $options: "i" } },
      ],
    };

    const users = await usersCollection
      .find(
        filter,

        {
          projection: { _id: false, passwordHash: false },
        }
      )
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const numberOfUsers = await usersCollection.countDocuments(filter);

    return {
      pagesCount: Math.ceil(numberOfUsers / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: numberOfUsers,
      items: users,
    };
  },
  async findUserById(id: string): Promise<AuthViewModel | null> {
    const user = await usersCollection.findOne(
      { id },
      { projection: { _id: false } }
    );

    if (user) {
      return {
        email: user.email,
        login: user.login,
        userId: user.id,
      };
    }
    return null;
  },
};
