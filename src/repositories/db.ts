import mongoose from "mongoose";
import { settings } from "../settings";

const mongoUrl = settings.mongo.url;

if (!mongoUrl) {
  throw new Error("Can't connect to db");
}

export async function runDb() {
  try {
    console.log(mongoUrl);
    await mongoose.connect(mongoUrl, {
      retryWrites: true,
      w: "majority",
      dbName: "blogApi",
    });
    console.log("Connected successfully to mongo server");
  } catch {
    console.log("Can't connect to db");
    await mongoose.disconnect();
  }
}
