import express from "express";
import { blogsRouter } from "./routes/blogs";
import { postsRouter } from "./routes/posts";

export const app = express();
const port = 3000;

// app.use()
app.use(express.json());

// routes
app.use("/blogs", blogsRouter);
app.use("/posts", postsRouter);

app.listen(port, () => {
  console.log(`App is listening on the port ${port}`);
});
