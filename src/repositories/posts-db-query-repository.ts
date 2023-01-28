import { PostsDBModel, PostsViewModel } from "../models/posts-model";
import { PostsModel } from "../models/posts-model/post-schema";
import { FilterQuery } from "mongoose";
import { injectable } from "inversify";

@injectable()
export class PostsQueryRepository {
  async findPosts(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string | undefined,
    blogId?: string
  ): Promise<PostsViewModel> {
    const filter: FilterQuery<PostsDBModel> = {};

    if (blogId) {
      filter.blogId = { $regex: blogId };
    }
    const posts: PostsDBModel[] = await PostsModel.find(filter, { _id: false })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();
    const numberOfPosts = await PostsModel.count(filter);

    return {
      pagesCount: Math.ceil(numberOfPosts / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: numberOfPosts,
      items: posts,
    };
  }
  async findPost(id: string): Promise<PostsDBModel | null> {
    const post: PostsDBModel | null = await PostsModel.findOne(
      { id },
      { _id: false }
    ).lean();
    return post;
  }
}
