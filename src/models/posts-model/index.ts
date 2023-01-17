export type CreatePostModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
export interface PostsDBModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
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
