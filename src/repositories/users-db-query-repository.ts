import { UsersViewModel } from "../models/users-model/UsersViewModel";
import { usersCollection } from "./db";

export const usersQueryRepository = {
  async findUsers(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string | undefined,
    searchLoginTerm: string | undefined | null,
    searchEmailTerm: string | undefined | null
  ): Promise<UsersViewModel> {
    const filter: any = {};
    const filter2: any = {};
    if (searchLoginTerm) {
      filter.login = { $regex: searchLoginTerm, $options: "i" };
    }
    if (searchEmailTerm) {
      filter2.email = { $regex: searchEmailTerm, $options: "i" };
    }

    const users = await usersCollection
      .find(
        { $or: [filter, filter2] },
        {
          projection: { _id: false, passwordHash: false },
        }
      )
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const numberOfUsers = await usersCollection.count({
      $or: [filter, filter2],
    });

    return {
      pagesCount: Math.ceil(numberOfUsers / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: numberOfUsers,
      items: users,
    };
  },
};
