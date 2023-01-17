import { UserAccountDBModel } from "../models/users-model";

export const mappedUsers = function (users: UserAccountDBModel[]) {
  const newUsers = users.map((user) => {
    return {
      id: user.id,
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt,
    };
  });
  return newUsers;
};
