import { CommentsDBModel } from "./comments-model/CommentsDBModel";

export type Pagination<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
};
