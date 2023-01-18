import { Pagination } from "../models/pagination.model";
import { mappedUsers } from "../utils/helpers";
import { AuthViewModel } from "../models/auth-model";
import { UserAccountDBModel, UsersViewModel } from "../models/users-model";
import { FilterQuery } from "mongoose";
import { UsersModel } from "../models/users-model/user-schema";

export const usersQueryRepository = {
  async findUsers(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string | undefined,
    searchLoginTerm: string | undefined | null,
    searchEmailTerm: string | undefined | null
  ): Promise<Pagination<UsersViewModel>> {
    const filter: FilterQuery<UserAccountDBModel> = {
      $or: [
        {
          "accountData.login": { $regex: searchLoginTerm ?? "", $options: "i" },
        },
        {
          "accountData.email": { $regex: searchEmailTerm ?? "", $options: "i" },
        },
      ],
    };
    const users = await UsersModel.find(filter, {
      projection: { _id: false, "accountData.passwordHash": false },
    })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const numberOfUsers = await UsersModel.countDocuments(filter);

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
    const user = await UsersModel.findOne({ id }, { _id: false });

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
    const user = await UsersModel.findOne({
      $or: [
        { "accountData.email": loginOrEmail },
        { "accountData.login": loginOrEmail },
      ],
    }).lean();
    return user;
  },
  async findUserByEmailConfirmationCode(
    code: string
  ): Promise<UserAccountDBModel | null> {
    const user = await UsersModel.findOne({
      "emailConfirmation.confirmationCode": code,
    }).lean();
    return user;
  },
  async findUserByPasswordConfirmationCode(
    code: string
  ): Promise<UserAccountDBModel | null> {
    const user = await UsersModel.findOne({
      "passwordRecovery.recoveryCode": code,
    }).lean();
    return user;
  },
};
