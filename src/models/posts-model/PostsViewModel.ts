import { PostsDBModel } from "./PostsDBModel";

export interface PostsViewModel {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostsDBModel[];
}
