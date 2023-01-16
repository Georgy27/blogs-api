import { randomUUID } from "crypto";
import { postsCollection } from "./db";
import { PostsDBModel } from "../models/posts-model/PostsDBModel";

export const postsRepository = {
  async createPost(newPost: PostsDBModel): Promise<PostsDBModel> {
    await postsCollection.insertOne({ ...newPost });
    return newPost;
  },
  async updatePost(
    postId: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ) {
    const result = await postsCollection.updateOne(
      { id: postId },
      {
        $set: { title, shortDescription, content, blogId },
      }
    );
    return result.matchedCount === 1;
  },
  async deletePost(id: string) {
    const result = await postsCollection.deleteOne({ id });
    return result.deletedCount === 1;
  },
  async clearPosts() {
    await postsCollection.deleteMany({});
  },
};
