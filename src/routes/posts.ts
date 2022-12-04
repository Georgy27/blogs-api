import { Request, Response, Router } from "express";
import addDays from "date-fns/addDays";
import { body, query } from "express-validator";
import { postsRepository } from "../repositories/posts-db-repository";
import { blogsRepository } from "../repositories/blogs-db-repository";
import { basicAuthMiddleware } from "../middlewares/basic-auth-middleware";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { blogsQueryRepository } from "../repositories/blogs-db-query-repository";
import { postsService } from "../domain/posts-service";
import { postsQueryRepository } from "../repositories/posts-db-query-repository";
export const postsRouter = Router({});

// middlewares
export const titleValidation = body("title")
  .isString()
  .trim()
  .notEmpty()
  .isLength({ max: 30 });
export const shortDescriptionValidation = body("shortDescription")
  .isString()
  .trim()
  .notEmpty()
  .isLength({ max: 100 });
export const contentValidation = body("content")
  .isString()
  .trim()
  .notEmpty()
  .isLength({ max: 1000 });
export const blogIdValidation = body("blogId")
  .isString()
  .custom(async (blogId) => {
    const findBlogWithId = await blogsQueryRepository.findBlog(blogId);

    if (!findBlogWithId) {
      throw new Error("blog with this id does not exist in the DB");
    } else {
      return true;
    }
  });
const pageNumberValidation = query("pageNumber").toInt().default(1);
const pageSize = query("pageSize").toInt().default(10);
const sortBy = query("sortBy").default("createdAt");
// routes
postsRouter.get(
  "/",
  pageSize,
  sortBy,
  pageNumberValidation,
  async (
    req: Request<
      {},
      {},
      {},
      {
        sortBy: string;
        sortDirection: string | null | undefined;
        pageSize: number;
        pageNumber: number;
      }
    >,
    res: Response
  ) => {
    const { sortBy, sortDirection } = req.query;
    const { pageSize, pageNumber } = req.query;
    const allPosts = await postsQueryRepository.findPosts(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection
    );
    res.status(200).send(allPosts);
  }
);
postsRouter.post(
  "/",
  basicAuthMiddleware,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
  inputValidationMiddleware,
  async (
    req: Request<
      {},
      {},
      {
        title: string;
        shortDescription: string;
        content: string;
        blogId: string;
      }
    >,
    res: Response
  ) => {
    const { title, shortDescription, content, blogId } = req.body;
    const blog = await blogsQueryRepository.findBlog(blogId);

    if (!blog) {
      return res.sendStatus(404);
    }

    const createPost = await postsService.createPost(
      title,
      shortDescription,
      content,
      blogId,
      blog.name
    );

    return res.status(201).send(createPost);
  }
);
postsRouter.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const postId = req.params.id;
  const getPost = await postsQueryRepository.findPost(postId);

  if (!getPost) {
    return res.sendStatus(404);
  } else {
    return res.status(200).send(getPost);
  }
});
postsRouter.put(
  "/:id",
  basicAuthMiddleware,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
  inputValidationMiddleware,
  async (
    req: Request<
      { id: string },
      {},
      {
        title: string;
        shortDescription: string;
        content: string;
        blogId: string;
      }
    >,
    res: Response
  ) => {
    const postId = req.params.id;
    const { title, shortDescription, content, blogId } = req.body;
    const getUpdatedPost = await postsService.updatePost(
      postId,
      title,
      shortDescription,
      content,
      blogId
    );

    if (!getUpdatedPost) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
  }
);
postsRouter.delete(
  "/:id",
  basicAuthMiddleware,
  async (req: Request<{ id: string }>, res: Response) => {
    const postId = req.params.id;
    const getDeletedPost = await postsService.deletePost(postId);

    if (!getDeletedPost) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
  }
);
