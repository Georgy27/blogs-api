import { ReactionsDBModel } from "../models/reactions-model";
import { ReactionsModel } from "../models/reactions-model/reactions-schema";

export class ReactionsRepository {
  async updateReaction(newReaction: ReactionsDBModel) {
    return ReactionsModel.findOneAndUpdate(
      {
        id: newReaction.id,
        parentId: newReaction.parentId,
        userId: newReaction.userId,
      },
      { newReaction },
      { upsert: true }
    );
  }
}
