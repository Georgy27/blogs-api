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
  async findBlogs() {
    return blogsCollection.find({}, { projection: { _id: false } }).toArray();
  },
  async createBlog(
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<IBlogs> {
    const newBlog: IBlogs = {
      id: randomUUID(),
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      createdAt: new Date().toISOString(),
    };
    await blogsCollection.insertOne({ ...newBlog });
    return newBlog;
  },
  async findBlog(id: string): Promise<IBlogs | null> {
    const blog = await blogsCollection.findOne(
      { id },
      { projection: { _id: false } }
    );
    return blog;
  },
  async updateBlog(
    blogId: string,
    name: string,
    description: string,
    websiteUrl: string
  ) {
    const result = await blogsCollection.updateOne(
      { id: blogId },
      {
        $set: { name, description, websiteUrl },
      }
    );
    return result.matchedCount === 1;
  },
  async deleteBlog(id: string) {
    const result = await blogsCollection.deleteOne({ id });
    return result.deletedCount === 1;
  },
  async clearBlogs() {
    await blogsCollection.deleteMany({});
  },
};
