import { Request, Response, Router } from "express";
import { blogs, blogsRepository } from "../repositories/blogs-repositories";

export const testingRouter = Router({});

testingRouter.delete("/", (req: Request, res: Response) => {
  const clearAllBlogs = blogsRepository.clearBlogs();
  return res.sendStatus(204);
});
