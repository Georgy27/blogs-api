import { Request, Response, Router } from "express";
import { blogs, blogsRepository } from "../repositories/blogs-repositories";
import { postsRepository } from "../repositories/posts-repositories";

export const testingRouter = Router({});

testingRouter.delete("/", (req: Request, res: Response) => {
  const clearAllBlogs = blogsRepository.clearBlogs();
  const clearAllPosts = postsRepository.clearPosts();
  return res.sendStatus(204);
});
