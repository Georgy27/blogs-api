import { commentsCollection } from "./db";
import { CommentsDBModel } from "../models/comments-model/CommentsDBModel";
import { CommentViewModel } from "../models/comments-model/CommentsViewModel";

export const commentsRepository = {
  async createComment(comment: CommentsDBModel): Promise<CommentViewModel> {
    await commentsCollection.insertOne({ ...comment });
    return {
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      createdAt: comment.createdAt,
    };
  },

  // async createCommentFake(comment: CommentsDBModel): Promise<CommViewModel> {
  //   await commentsCollection.insertOne({ ...comment });
  //   return new CommViewModel(
  //     comment.id,
  //     comment.content,
  //     comment.userId,
  //     comment.userLogin,
  //     comment.createdAt
  //   );
  // },

  async updateComment(content: string, id: string): Promise<boolean> {
    const result = await commentsCollection.updateOne(
      { id: id },
      {
        $set: { content },
      }
    );
    return result.matchedCount === 1;
  },
  async deleteComment(id: string): Promise<boolean> {
    const result = await commentsCollection.deleteOne({ id });
    return result.deletedCount === 1;
  },
  async clearComments() {
    await commentsCollection.deleteMany({});
  },
};
