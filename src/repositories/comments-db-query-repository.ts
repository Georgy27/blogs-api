import { CommentsViewModel } from "../models/comments-model/CommentsViewModel";
import { Filter } from "mongodb";
import { CommentsDBModel } from "../models/comments-model/CommentsDBModel";
import { commentsCollection } from "./db";

export const commentsQueryRepository = {
  async findComments(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string | undefined,
    postId: string
  ): Promise<CommentsViewModel> {
    const comments = await commentsCollection
      .find({}, { projection: { _id: false } })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    const numberOfComments = await commentsCollection.countDocuments();

    return {
      pagesCount: Math.ceil(numberOfComments / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: numberOfComments,
      items: comments,
    };
  },
};
