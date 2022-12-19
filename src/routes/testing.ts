import { Request, Response, Router } from "express";
import { blogsRepository } from "../repositories/blogs-db-repository";
import { postsRepository } from "../repositories/posts-db-repository";
import { usersRepository } from "../repositories/users-db-repository";
import { commentsRepository } from "../repositories/comments-db-repository";

export const testingRouter = Router({});

testingRouter.delete("/", async (req: Request, res: Response) => {
  await blogsRepository.clearBlogs();
  await postsRepository.clearPosts();
  await usersRepository.clearUsers();
  await commentsRepository.clearComments();
  return res.sendStatus(204);
});
