import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import { BlogsDBModel } from "../models/blogs-model/BlogsDBModel";
import { PostsDBModel } from "../models/posts-model/PostsDBModel";
import { CommentsDBModel } from "../models/comments-model/CommentsDBModel";
import { UserAccountDBModel } from "../models/users-model/UserAccountDBModel";
import { UserTokenDBModel } from "../models/token-model/UserTokenDBModel";
dotenv.config();

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  throw new Error("Can't connect to db");
}
const client = new MongoClient(mongoUrl);
export const db = client.db("blog-api");
export const blogsCollection = db.collection<BlogsDBModel>("blogs", {});
export const postsCollection = db.collection<PostsDBModel>("posts");
export const usersCollection = db.collection<UserAccountDBModel>("users");
export const commentsCollection = db.collection<CommentsDBModel>("comments");
export const userTokenCollection =
  db.collection<UserTokenDBModel>("user_tokens");

export async function runDb() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    // await client.db("learning").command({ ping: 1 });
    console.log("Connected successfully to mongo server");
  } catch {
    console.log("Can't connect to db");
    await client.close();
  }
}
