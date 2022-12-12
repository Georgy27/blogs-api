export type QueryUserModel = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string | undefined;
  searchLoginTerm: string | undefined;
  searchEmailTerm: string | undefined;
};
