import mongoose, { Schema } from "mongoose";
import { PostsDBModel } from "./index";

const PostsSchema = new Schema<PostsDBModel>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

export const PostsModel = mongoose.model<PostsDBModel>("posts", PostsSchema);
