import { randomUUID } from "crypto";
import { blogsCollection, postsCollection } from "./db";

export interface IPosts {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
}

export const postsRepository = {
  async createPost(newPost: IPosts): Promise<IPosts> {
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
