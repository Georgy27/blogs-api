import { ReactionsDBModel } from "../models/reactions-model";
import { ReactionsModel } from "../models/reactions-model/reactions-schema";
import { BlogsModel } from "../models/blogs-model/blog-schema";

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
    console.log(updatedReaction);
    if (!updatedReaction) return null;
    console.log(updatedReaction.status);
    return updatedReaction;
  }
  async clearReactions() {
    await ReactionsModel.deleteMany({});
  }
}
