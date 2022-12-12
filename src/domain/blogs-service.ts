import { randomUUID } from "crypto";
import { blogsRepository } from "../repositories/blogs-db-repository";
import { BlogsDBModel } from "../models/blogs-model/BlogsDBModel";

export const blogsService = {
  async createBlog(
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<BlogsDBModel> {
    const newBlog: BlogsDBModel = {
      id: randomUUID(),
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      createdAt: new Date().toISOString(),
    };
    return blogsRepository.createBlog(newBlog);
  },

  async updateBlog(
    blogId: string,
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<boolean> {
    return blogsRepository.updateBlog(blogId, name, description, websiteUrl);
  },
  async deleteBlog(id: string): Promise<boolean> {
    return blogsRepository.deleteBlog(id);
  },
};
