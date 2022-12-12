export const usersQueryRepository = {
  async findUsers(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string | undefined,
    searchLoginTerm: string | undefined,
    searchEmailTerm: string | undefined
  ) {},
};
