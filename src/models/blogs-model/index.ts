export interface BlogsDBModel {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
}
export interface BlogsViewModel {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
}
export type CreateBlogModel = {
  name: string;
  description: string;
  websiteUrl: string;
};
export type CreatePostForBLogIdModel = {
  title: string;
  shortDescription: string;
  content: string;
};
export type QueryBlogModel = {
  searchNameTerm: string | undefined | null;
  sortBy: string;
  sortDirection: string | undefined;
  pageSize: number;
  pageNumber: number;
};
export type QueryPostForBlogIdModel = {
  sortBy: string;
  sortDirection: string | undefined;
  pageSize: number;
  pageNumber: number;
};
export type UpdateBlogModel = {
  name: string;
  description: string;
  websiteUrl: string;
};
