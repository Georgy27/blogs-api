import { commentsRepository } from "../repositories/comments-db-repository";
import { CommentsDBModel } from "../models/comments-model/CommentsDBModel";
import { randomUUID } from "crypto";
import { CommentViewModel } from "../models/comments-model/CommentsViewModel";

export const commentsService = {
  async createComment(
    postId: string,
    comment: string,
    userId: string,
    userLogin: string
  ): Promise<CommentViewModel> {
    const newComment: CommentsDBModel = {
      id: randomUUID(),
      postId,
      content: comment,
      userId: userId,
      userLogin: userLogin,
      createdAt: new Date().toISOString(),
    };
    return commentsRepository.createComment(newComment);
  },
  async updateComment(content: string, id: string): Promise<boolean> {
    return commentsRepository.updateComment(content, id);
  },
  async deleteComment(id: string) {
    return commentsRepository.deleteComment(id);
  },
};
