import * as dotenv from "dotenv";
dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.orhfxbm.mongodb.net`;

export const settings = {
  mongo: {
    url: MONGO_URL,
  },
  JWT_SECRET: process.env.JWT_SECRET || "5587",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "3285932",
};
