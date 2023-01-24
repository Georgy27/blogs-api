import { Pagination } from "../models/pagination.model";
import { CommentViewModel } from "../models/comments-model";
import { CommentsModel } from "../models/comments-model/comment-schema";

export class CommentsQueryRepository {
  async findComments(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string | undefined,
    postId: string
  ): Promise<Pagination<CommentViewModel>> {
    const comments = await CommentsModel.find(
      { postId },
      { _id: false, postId: false }
    )
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const numberOfComments = await CommentsModel.countDocuments({
      postId,
    });

    return {
      pagesCount: Math.ceil(numberOfComments / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: numberOfComments,
      items: comments,
    };
  }
  async findComment(id: string): Promise<CommentViewModel | null> {
    return CommentsModel.findOne({ id }, { _id: false, postId: false });
  }
}
