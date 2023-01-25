import mongoose, { Schema } from "mongoose";
import { ReactionsDBModel, reactionStatusEnum } from "./index";

const ReactionsSchema = new Schema<ReactionsDBModel>(
  {
    id: { type: String, required: true, unique: true },
    parentType: { type: String, required: true },
    parentId: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(reactionStatusEnum),
      required: true,
    },
    addedAt: { type: String, required: true },
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

export const ReactionsModel = mongoose.model<ReactionsDBModel>(
  "reactions",
  ReactionsSchema
);
