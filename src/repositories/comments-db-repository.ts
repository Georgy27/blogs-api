import { commentsCollection } from "./db";
import { CommentsDBModel } from "../models/comments-model/CommentsDBModel";

export const commentsRepository = {
  async createComment(comment: CommentsDBModel) {
    await commentsCollection.insertOne({ ...comment });
    return comment;
  },
};
