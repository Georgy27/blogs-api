import { ReactionsDBModel } from "../models/reactions-model";
import { ReactionsModel } from "../models/reactions-model/reactions-schema";

export class ReactionsRepository {
  async updateReaction(newReaction: ReactionsDBModel) {
    console.log(newReaction);
    const filter = {
      // id: newReaction.id,
      parentId: newReaction.parentId,
      userId: newReaction.userId,
    };
    const updatedReaction = await ReactionsModel.findOneAndUpdate(
      filter,
      newReaction,
      { upsert: true, new: true }
    ).lean();
    if (!updatedReaction) return null;
    return updatedReaction;
  }
  async clearReactions() {
    await ReactionsModel.deleteMany({});
  }
}
