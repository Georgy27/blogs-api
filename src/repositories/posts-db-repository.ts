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
  async findPosts() {
    return postsCollection.find({}, { projection: { _id: false } }).toArray();
  },
  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
  ) {
    const newPost = {
      id: randomUUID(),
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
      blogName: blogName,
      createdAt: new Date().toISOString(),
    };
    await postsCollection.insertOne({ ...newPost });
    return newPost;
  },
  async findPost(id: string) {
    const post = await postsCollection.findOne(
      { id },
      { projection: { _id: false } }
    );
    return post;
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
