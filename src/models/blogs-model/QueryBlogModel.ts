export type QueryBlogModel = {
  searchNameTerm: string | undefined;
  sortBy: string;
  sortDirection: string | undefined;
  pageSize: number;
  pageNumber: number;
};
