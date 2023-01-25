import mongoose, { Schema } from "mongoose";
import { CommentsDBModel } from "./index";
import { reactionStatusEnum, reactionStatusEnumKeys } from "../reactions-model";

const CommentsSchema = new Schema<CommentsDBModel>(
  {
    id: { type: String, required: true, unique: true },
    postId: { type: String, required: true },
    content: { type: String, required: true },
    commentatorInfo: {
      userId: { type: String, required: true },
      userLogin: { type: String, required: true },
    },
    createdAt: { type: String, required: true },
    likesInfo: {
      likesCount: { type: Number, required: true },
      dislikesCount: { type: Number, required: true },
      myStatus: {
        type: String,
        enum: Object.values(reactionStatusEnum),
        required: true,
        ref: "reactions",
      },
    },
  },
  {
    versionKey: false,
  }
);

export const CommentsModel = mongoose.model<CommentsDBModel>(
  "comments",
  CommentsSchema
);
