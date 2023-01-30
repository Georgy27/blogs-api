import { reactionStatusEnumKeys } from "../reactions-model";

export type CreatePostModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
export interface ExtendedLikesInfoModel {
  likesCount: number;
  dislikesCount: number;
  myStatus: reactionStatusEnumKeys;
  newestLikes: {
    addedAt: string;
    userId: string;
    login: string;
  }[];
}
export interface PostsDBModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfoModel;
}
export interface PostsViewModel {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostsDBModel[];
}
export type QueryPostModel = {
  sortBy: string;
  sortDirection: string | undefined;
  pageSize: number;
  pageNumber: number;
};
export type UpdatePostModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
