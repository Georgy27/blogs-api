import { blogsCollection, commentsCollection } from "./db";
import { CommentsDBModel } from "../models/comments-model/CommentsDBModel";

export const commentsRepository = {
  async createComment(comment: CommentsDBModel) {
    await commentsCollection.insertOne({ ...comment });
    return comment;
  },
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
