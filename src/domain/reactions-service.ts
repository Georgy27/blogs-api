import { CommentsDBModel } from "../models/comments-model";
import {
  ReactionsDBModel,
  reactionStatusEnum,
} from "../models/reactions-model";
import { randomUUID } from "crypto";
import { ReactionsRepository } from "../repositories/reactions-db-repository";

export class ReactionsService {
  constructor(protected reactionsRepository: ReactionsRepository) {}
  // async updateReaction(comment: CommentsDBModel) {
  async updateReaction(
    parentType: string,
    parentId: string,
    userId: string,
    userLogin: string,
    status: reactionStatusEnum
  ) {
    const newReaction: ReactionsDBModel = {
      id: randomUUID(),
      parentType: parentType,
      parentId,
      status,
      addedAt: new Date().toISOString(),
      userId,
      userLogin,
    };
    return this.reactionsRepository.updateReaction(newReaction);
  }
}
