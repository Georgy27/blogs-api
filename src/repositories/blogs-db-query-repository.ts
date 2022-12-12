import { blogsCollection } from "./db";
import { BlogsViewModel } from "../models/blogs-model/BlogsViewModel";
import { BlogsDBModel } from "../models/blogs-model/BlogsDBModel";

export const blogsQueryRepository = {
  async findBlogs(
    searchNameTerm: string | undefined | null,
    pageSize: number,
    sortBy: string,
    pageNumber: number,
    sortDirection: string | undefined
  ): Promise<BlogsViewModel> {
    const filter: Partial<
      Record<
        keyof Omit<BlogsDBModel, "id">,
        { $regex: string; $options: string }
      >
    > = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: "i" };
    }

    const blogs: BlogsDBModel[] = await blogsCollection
      .find(filter, { projection: { _id: false } })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    const numberOfBlogs = await blogsCollection.count(filter);

    return {
      pagesCount: Math.ceil(numberOfBlogs / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: numberOfBlogs,
      items: blogs,
    };
  },

  async findBlog(id: string): Promise<BlogsDBModel | null> {
    const blog = await blogsCollection.findOne(
      { id },
      { projection: { _id: false } }
    );
    return blog;
  },
};
