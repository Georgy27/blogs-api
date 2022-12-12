import { blogsCollection, postsCollection } from "./db";
import { PostsViewModel } from "../models/posts-model/PostsViewModel";
import { PostsDBModel } from "../models/posts-model/PostsDBModel";

export const postsQueryRepository = {
  async findPosts(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string | undefined,
    blogId?: string
  ): Promise<PostsViewModel> {
    const filter: any = {};

    if (blogId) {
      filter.blogId = { $regex: blogId };
    }
    console.log(filter);
    const posts: PostsDBModel[] = await postsCollection
      .find(filter, { projection: { _id: false } })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    const numberOfPosts = await postsCollection.count(filter);

    return {
      pagesCount: Math.ceil(numberOfPosts / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: numberOfPosts,
      items: posts,
    };
  },

  async findPost(id: string) {
    const post = await postsCollection.findOne(
      { id },
      { projection: { _id: false } }
    );
    return post;
  },
};
