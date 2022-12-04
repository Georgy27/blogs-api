import { randomUUID } from "crypto";
import { blogsCollection } from "./db";

export interface IBlogs {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
}

export const blogsRepository = {
  async createBlog(newBlog: IBlogs): Promise<IBlogs> {
    await blogsCollection.insertOne({ ...newBlog });
    return newBlog;
  },
  async updateBlog(
    blogId: string,
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<boolean> {
    const result = await blogsCollection.updateOne(
      { id: blogId },
      {
        $set: { name, description, websiteUrl },
      }
    );
    return result.matchedCount === 1;
  },
  async deleteBlog(id: string): Promise<boolean> {
    const result = await blogsCollection.deleteOne({ id });
    return result.deletedCount === 1;
  },
  async clearBlogs() {
    await blogsCollection.deleteMany({});
  },
};
