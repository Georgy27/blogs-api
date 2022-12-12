export type QueryUserModel = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string | undefined;
  searchLoginTerm: string | undefined | null;
  searchEmailTerm: string | undefined | null;
};
