import mongoose, { Schema } from "mongoose";
import { CommentsDBModel } from "./index";

const CommentsSchema = new Schema<CommentsDBModel>(
  {
    id: { type: String, required: true, unique: true },
    postId: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

export const CommentsModel = mongoose.model<CommentsDBModel>(
  "comments",
  CommentsSchema
);
