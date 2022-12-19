import { commentsRepository } from "../repositories/comments-db-repository";
import { CommentsDBModel } from "../models/comments-model/CommentsDBModel";
import { randomUUID } from "crypto";

export const commentsService = {
  async createComment(
    comment: string,
    userId: string,
    userLogin: string
  ): Promise<CommentsDBModel> {
    const newComment: CommentsDBModel = {
      id: randomUUID(),
      content: comment,
      userId: userId,
      userLogin: userLogin,
      createdAt: new Date().toISOString(),
    };
    return commentsRepository.createComment(newComment);
  },
};
