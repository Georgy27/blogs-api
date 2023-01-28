import { BlogsDBModel } from "../models/blogs-model";
import { BlogsModel } from "../models/blogs-model/blog-schema";
import { injectable } from "inversify";

@injectable()
export class BlogsRepository {
  async createBlog(newBlog: BlogsDBModel): Promise<BlogsDBModel> {
    await BlogsModel.create({ ...newBlog });
    return newBlog;
  }
  async updateBlog(
    blogId: string,
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<boolean> {
    const result = await BlogsModel.updateOne(
      { id: blogId },

      { name, description, websiteUrl }
    );
    return result.matchedCount === 1;
  }
  async deleteBlog(id: string): Promise<boolean> {
    const result = await BlogsModel.deleteOne({ id });
    return result.deletedCount === 1;
  }
  async clearBlogs() {
    await BlogsModel.deleteMany({});
  }
}
