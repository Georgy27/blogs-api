import { MongoClient } from "mongodb";
import { IBlogs } from "./blogs-db-repository";
import { IPosts } from "./posts-db-repository";
const mongoUri = "mongodb://localhost";

const client = new MongoClient(mongoUri);
export const db = client.db("blog-api");
export const blogsCollection = db.collection<IBlogs>("blogs", {});
export const postsCollection = db.collection<IPosts>("posts");

export async function runDb() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db("learning").command({ ping: 1 });
    console.log("Connected successfully to mongo server");
  } catch {
    console.log("Can't connect to db");
    await client.close();
  }
}
