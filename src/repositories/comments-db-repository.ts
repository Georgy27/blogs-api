import { CommentsDBModel, CommentViewModel } from "../models/comments-model";
import { CommentsModel } from "../models/comments-model/comment-schema";

export const commentsRepository = {
  async createComment(comment: CommentsDBModel): Promise<CommentViewModel> {
    await CommentsModel.create({ ...comment });
    return {
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      createdAt: comment.createdAt,
    };
  },
  async updateComment(content: string, id: string): Promise<boolean> {
    const result = await CommentsModel.updateOne(
      { id: id },

      { content }
    );
    return result.matchedCount === 1;
  },
  async deleteComment(id: string): Promise<boolean> {
    const result = await CommentsModel.deleteOne({ id });
    return result.deletedCount === 1;
  },
  async clearComments() {
    await CommentsModel.deleteMany({});
  },
};
