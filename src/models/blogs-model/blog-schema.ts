import mongoose, { Schema } from "mongoose";
import { BlogsDBModel } from "./index";

const BlogsSchema = new Schema<BlogsDBModel>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

enum reactionStatusEnum {
  Like = "Like",
  Dislike = "Dislike",
  None = "None",
}

const testSchema = new Schema(
  {
    id: String,
    parentType: String,
    parentId: String,
    status: { type: String, enum: reactionStatusEnum },
    addedAt: String,
    userId: String,
    userLogin: String,
  },
  {
    versionKey: false,
  }
);
// upsert in options while updating (look at how its done in device)
export const BlogsModel = mongoose.model<BlogsDBModel>("blogs", BlogsSchema);
