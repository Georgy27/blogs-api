export type QueryBlogModel = {
  searchNameTerm: string | undefined | null;
  sortBy: string;
  sortDirection: string | undefined;
  pageSize: number;
  pageNumber: number;
};
