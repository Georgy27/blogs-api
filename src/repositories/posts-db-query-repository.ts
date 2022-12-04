import { randomUUID } from "crypto";
import { blogsCollection, postsCollection } from "./db";

interface IPost {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
}
interface IPosts {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: IPost[];
}

export const postsQueryRepository = {
  async findPosts(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string | undefined | null
  ): Promise<IPosts> {
    const posts: IPost[] = await postsCollection
      .find({}, { projection: { _id: false } })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    const numberOfPosts = await postsCollection.count(
      {},
      { skip: (pageNumber - 1) * pageSize, limit: pageSize }
    );

    return {
      pagesCount: Math.ceil(numberOfPosts / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: numberOfPosts,
      items: posts,
    };
  },

  async findPost(id: string) {
    const post = await postsCollection.findOne(
      { id },
      { projection: { _id: false } }
    );
    return post;
  },
};
