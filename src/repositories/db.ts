import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import { settings } from "../settings";
import { SessionsDBModel } from "../models/sessions-model";

const mongoUrl = settings.mongo.url;

if (!mongoUrl) {
  throw new Error("Can't connect to db");
}
const client = new MongoClient(mongoUrl);
export const db = client.db("blog-api");

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
