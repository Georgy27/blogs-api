import { randomUUID } from "crypto";
import { BlogsDBModel } from "../models/blogs-model";
import { BlogsRepository } from "../repositories/blogs-db-repository";

export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}
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
    return this.blogsRepository.createBlog(newBlog);
  }
  async updateBlog(
    blogId: string,
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<boolean> {
    return this.blogsRepository.updateBlog(
      blogId,
      name,
      description,
      websiteUrl
    );
  }
  async deleteBlog(id: string): Promise<boolean> {
    return this.blogsRepository.deleteBlog(id);
  }
}
