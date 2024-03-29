import {
  ReactionsDBModel,
  reactionStatusEnumKeys,
} from "../models/reactions-model";
import { randomUUID } from "crypto";
import { ReactionsRepository } from "../repositories/reactions-db-repository";
import { inject, injectable } from "inversify";

@injectable()
export class ReactionsService {
  constructor(
    @inject(ReactionsRepository)
    protected reactionsRepository: ReactionsRepository
  ) {}
  async updateReaction(
    parentType: string,
    parentId: string,
    userId: string,
    userLogin: string,
    status: reactionStatusEnumKeys
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
