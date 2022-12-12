import { BlogsDBModel } from "./BlogsDBModel";

export interface BlogsViewModel {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogsDBModel[];
}
