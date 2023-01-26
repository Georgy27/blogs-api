import { CommentsDBModel, CommentViewModel } from "../models/comments-model";
import { CommentsModel } from "../models/comments-model/comment-schema";

export class CommentsRepository {
  async createComment(comment: CommentsDBModel): Promise<CommentViewModel> {
    const newComment = await CommentsModel.create({ ...comment });
    return {
      id: newComment.id,
      content: newComment.content,
      commentatorInfo: {
        userId: newComment.commentatorInfo.userId,
        userLogin: newComment.commentatorInfo.userLogin,
      },
      createdAt: newComment.createdAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
      },
    };
  }
  async updateComment(content: string, id: string): Promise<boolean> {
    const result = await CommentsModel.updateOne(
      { id: id },

      { content }
    );
    return result.matchedCount === 1;
  }
  async deleteComment(id: string): Promise<boolean> {
    const result = await CommentsModel.deleteOne({ id });
    return result.deletedCount === 1;
  }
  async clearComments() {
    await CommentsModel.deleteMany({});
  }
}
