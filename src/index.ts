import express from "express";
import { blogsRouter } from "./routes/blogs";
import { postsRouter } from "./routes/posts";
import { testingRouter } from "./routes/testing";
import { runDb } from "./repositories/db";
import { usersRouter } from "./routes/users";
import { authRouter } from "./routes/auth";
// remove app to a different folder
export const app = express();
const port = 3000;

// app.use()
app.use(express.json());

// routes
app.use("/testing/all-data", testingRouter);
app.use("/blogs", blogsRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);
app.use("/auth/login", authRouter);

const startApp = async () => {
  await runDb();
  app.listen(port, () => {
    console.log(`App is listening on the port ${port}`);
  });
};

startApp();
