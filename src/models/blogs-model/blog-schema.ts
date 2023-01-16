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

export const BlogsModel = mongoose.model<BlogsDBModel>("blogs", BlogsSchema);
