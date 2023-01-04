import express from "express";
import { testingRouter } from "../routes/testing";
import { blogsRouter } from "../routes/blogs";
import { postsRouter } from "../routes/posts";
import { usersRouter } from "../routes/users";
import { authRouter } from "../routes/auth";
import { commentsRouter } from "../routes/comments";
import cookieParser from "cookie-parser";

export function createServer() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  // routes
  app.use("/testing/all-data", testingRouter);
  app.use("/blogs", blogsRouter);
  app.use("/posts", postsRouter);
  app.use("/users", usersRouter);
  app.use("/auth", authRouter);
  app.use("/comments", commentsRouter);
  return app;
}
