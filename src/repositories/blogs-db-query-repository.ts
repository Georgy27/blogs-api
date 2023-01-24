import { Pagination } from "../models/pagination.model";
import { BlogsDBModel, BlogsViewModel } from "../models/blogs-model";
import { BlogsModel } from "../models/blogs-model/blog-schema";
import { FilterQuery } from "mongoose";

export class BlogsQueryRepository {
  async findBlogs(
    searchNameTerm: string | undefined | null,
    pageSize: number,
    sortBy: string,
    pageNumber: number,
    sortDirection: string | undefined
  ): Promise<Pagination<BlogsViewModel>> {
    const filter: FilterQuery<BlogsDBModel> = {
      $regex: searchNameTerm ?? "",
      $options: "i",
    };

    const blogs: BlogsDBModel[] = await BlogsModel.find(filter, { _id: false })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const numberOfBlogs = await BlogsModel.countDocuments(filter);

    return {
      pagesCount: Math.ceil(numberOfBlogs / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: numberOfBlogs,
      items: blogs,
    };
  }

  async findBlog(id: string): Promise<BlogsDBModel | null> {
    const blog: BlogsDBModel | null = await BlogsModel.findOne(
      { id },
      { _id: false }
    ).lean();
    return blog;
  }
}
