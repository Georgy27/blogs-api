import { UsersViewModel } from "../models/users-model/UsersViewModel";
import { usersCollection } from "./db";
import { Filter } from "mongodb";
import { Pagination } from "../models/pagination.model";
import { UserAccountDBModel } from "../models/users-model/UserAccountDBModel";
import { mappedUsers } from "../utils/helpers";
import { AuthViewModel } from "../models/auth-model";

export const usersQueryRepository = {
  async findUsers(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string | undefined,
    searchLoginTerm: string | undefined | null,
    searchEmailTerm: string | undefined | null
  ): Promise<Pagination<UsersViewModel>> {
    const filter: Filter<UserAccountDBModel> = {
      $or: [
        {
          "accountData.login": { $regex: searchLoginTerm ?? "", $options: "i" },
        },
        {
          "accountData.email": { $regex: searchEmailTerm ?? "", $options: "i" },
        },
      ],
    };
    const users = await usersCollection
      .find(filter, {
        projection: { _id: false, "accountData.passwordHash": false },
      })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const numberOfUsers = await usersCollection.countDocuments(filter);

    console.log(users);
    return {
      pagesCount: Math.ceil(numberOfUsers / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: numberOfUsers,
      items: mappedUsers(users),
    };
  },
  async findUserById(id: string): Promise<AuthViewModel | null> {
    const user = await usersCollection.findOne(
      { id },
      { projection: { _id: false } }
    );

    if (user) {
      return {
        email: user.accountData.email,
        login: user.accountData.login,
        userId: user.id,
      };
    }
    return null;
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
    return user;
  },
  async findUserByConfirmationCode(
    code: string
  ): Promise<UserAccountDBModel | null> {
    const user = await usersCollection.findOne({
      "emailConfirmation.confirmationCode": code,
    });
    return user;
  },
};
