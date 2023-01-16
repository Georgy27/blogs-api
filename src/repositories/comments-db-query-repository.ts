import { Filter } from "mongodb";
import { CommentsDBModel } from "../models/comments-model/CommentsDBModel";
import { commentsCollection } from "./db";
import { Pagination } from "../models/pagination.model";
import { CommentViewModel } from "../models/comments-model/CommentsViewModel";

export const commentsQueryRepository = {
  async findComments(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string | undefined,
    postId: string
  ): Promise<Pagination<CommentViewModel>> {
    const comments = await commentsCollection
      .find({ postId }, { projection: { _id: false, postId: false } })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    const numberOfComments = await commentsCollection.countDocuments({
      postId,
    });

    return {
      pagesCount: Math.ceil(numberOfComments / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: numberOfComments,
      items: comments,
    };
  },
  async findComment(id: string): Promise<CommentViewModel | null> {
    return await commentsCollection.findOne(
      { id },
      { projection: { _id: false, postId: false } }
    );
  },
};
