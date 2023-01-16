import { MongoClient } from "mongodb";
import { PostsDBModel } from "../models/posts-model/PostsDBModel";
import { CommentsDBModel } from "../models/comments-model/CommentsDBModel";
import { UserAccountDBModel } from "../models/users-model/UserAccountDBModel";
import { SessionsDBModel } from "../models/token-model/SessionsDBModel";
import mongoose from "mongoose";
import { settings } from "../settings";

const mongoUrl = settings.mongo.url;

if (!mongoUrl) {
  throw new Error("Can't connect to db");
}
const client = new MongoClient(mongoUrl);
export const db = client.db("blog-api");

export const postsCollection = db.collection<PostsDBModel>("posts");
export const usersCollection = db.collection<UserAccountDBModel>("users");
export const commentsCollection = db.collection<CommentsDBModel>("comments");
export const refreshTokensMetaCollection =
  db.collection<SessionsDBModel>("refresh_tokens");

export async function runDb() {
  try {
    await client.connect();
    await mongoose.connect(mongoUrl, { retryWrites: true, w: "majority" });
    console.log("Connected successfully to mongo server");
  } catch {
    console.log("Can't connect to db");
    await mongoose.disconnect();
  }
}
