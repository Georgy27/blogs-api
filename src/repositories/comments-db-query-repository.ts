import { Pagination } from "../models/pagination.model";
import { CommentsDBModel, CommentViewModel } from "../models/comments-model";
import { CommentsModel } from "../models/comments-model/comment-schema";
import { ReactionsModel } from "../models/reactions-model/reactions-schema";
import {
  reactionStatusEnum,
  reactionStatusEnumKeys,
} from "../models/reactions-model";

export class CommentsQueryRepository {
  async findComments(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string | undefined,
    postId: string,
    userId: string | null
  ): Promise<Pagination<CommentViewModel>> {
    const comments = await CommentsModel.find(
      { postId },
      { _id: false, postId: false }
    )
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const commentsWithLikesInfo = await Promise.all(
      comments.map(async (comment) => {
        return this.addLikesInfoToComment(comment, userId);
      })
    );

    const numberOfComments = await CommentsModel.countDocuments({
      postId,
    });

    return {
      pagesCount: Math.ceil(numberOfComments / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: numberOfComments,
      items: commentsWithLikesInfo,
    };
  }
  async findComment(id: string): Promise<CommentViewModel | null> {
    const comment = await CommentsModel.findOne(
      { id },
      { _id: false, postId: false }
    ).lean();
    return comment;
  }
  async findCommentWithLikesInfo(
    id: string,
    userId: string | null
  ): Promise<CommentViewModel | null> {
    const comment = await CommentsModel.findOne(
      { id },
      { _id: false, postId: false }
    ).lean();
    if (!comment) return null;
    return this.addLikesInfoToComment(comment, userId);
  }
  private async addLikesInfoToComment(
    comment: CommentsDBModel,
    userId: string | null
  ) {
    const likes = await ReactionsModel.countDocuments({
      parentId: comment.id,
      status: "Like",
    });
    console.log(likes);
    const dislikes = await ReactionsModel.countDocuments({
      parentId: comment.id,
      status: reactionStatusEnum.Dislike,
    });
    let myStatus: reactionStatusEnumKeys = "None";
    if (userId) {
      // console.log("I am user");
      const myStatusFromDb = await ReactionsModel.findOne(
        { parentId: comment.id, userId: userId },
        { _id: 0 }
      ).lean();
      if (myStatusFromDb) {
        myStatus = myStatusFromDb.status;
      }
    }
    comment.likesInfo.likesCount = likes;
    comment.likesInfo.dislikesCount = dislikes;
    comment.likesInfo.myStatus = myStatus;
    return comment;
  }
}
