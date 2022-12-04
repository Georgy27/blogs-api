import { blogsCollection } from "./db";

interface IBlog {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
}
interface IBlogs {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: IBlog[];
}

export const blogsQueryRepository = {
  async findBlogs(
    searchNameTerm: string | undefined | null,
    pageSize: number,
    sortBy: string,
    pageNumber: number,
    sortDirection: string | undefined | null
  ): Promise<IBlogs> {
    const filter: Partial<Record<keyof Omit<IBlog, "id">, { $regex: string }>> =
      {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm };
    }

    const blogs: IBlog[] = await blogsCollection
      .find(filter, { projection: { _id: false } })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    const numberOfBlogs = await blogsCollection.count(
      { filter },
      { skip: (pageNumber - 1) * pageSize, limit: pageSize }
    );
    console.log(numberOfBlogs);

    return {
      pagesCount: Math.ceil(numberOfBlogs / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: numberOfBlogs,
      items: blogs,
    };
  },

  async findBlog(id: string): Promise<IBlog | null> {
    const blog = await blogsCollection.findOne(
      { id },
      { projection: { _id: false } }
    );
    return blog;
  },
};
