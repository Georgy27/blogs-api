import { CommentsDBModel } from "./CommentsDBModel";

export type CommentsViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentsDBModel[];
};
