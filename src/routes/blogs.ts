import { Request, Response, Router, NextFunction } from "express";
import { body, query } from "express-validator";
import { blogsRepository } from "../repositories/blogs-db-repository";
import { basicAuthMiddleware } from "../middlewares/basic-auth-middleware";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { blogsService } from "../domain/blogs-service";
import { blogsQueryRepository } from "../repositories/blogs-db-query-repository";
import {
  blogIdValidation,
  contentValidation,
  shortDescriptionValidation,
  titleValidation,
} from "./posts";
import { postsService } from "../domain/posts-service";
import { postsQueryRepository } from "../repositories/posts-db-query-repository";
export const blogsRouter = Router({});

// middlewares
const nameValidation = body("name")
  .isString()
  .trim()
  .notEmpty()
  .isLength({ max: 15 })
  .withMessage("name can not be longer than 15 characters");
const descriptionValidation = body("description")
  .isString()
  .trim()
  .notEmpty()
  .isLength({ max: 500 });
const websiteValidation = body("websiteUrl")
  .isLength({ max: 100 })
  .matches(
    "^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$"
  );
const pageNumberValidation = query("pageNumber").toInt().default(1);
const pageSize = query("pageSize").toInt().default(10);
const sortBy = query("sortBy").default("createdAt");
// const sortDirection = query("sortDirection");
// const searchNameTerm = query("searchNameTerm").default(null);

// routes
blogsRouter.get(
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
        searchNameTerm: string | null | undefined;
        sortBy: string;
        sortDirection: string | null | undefined;
        pageSize: number;
        pageNumber: number;
      }
    >,
    res: Response
  ) => {
    const { searchNameTerm, sortBy, sortDirection } = req.query;
    const { pageSize, pageNumber } = req.query;
    console.log(searchNameTerm);
    const allBlogs = await blogsQueryRepository.findBlogs(
      searchNameTerm,
      pageSize,
      sortBy,
      pageNumber,
      sortDirection
    );
    res.status(200).send(allBlogs);
  }
);

// returns all posts for specified blog
blogsRouter.get(
  "/:blogId/posts",
  pageSize,
  sortBy,
  pageNumberValidation,
  async (
    req: Request<
      { blogId: string },
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
    const blogId = req.params.blogId;
    const getBlogById = await blogsQueryRepository.findBlog(blogId);

    if (!getBlogById) {
      return res.sendStatus(404);
    }
    const allPostsWithId = await postsQueryRepository.findPosts(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      blogId
    );
    res.status(200).send(allPostsWithId);
  }
);

blogsRouter.post(
  "/",
  basicAuthMiddleware,
  nameValidation,
  descriptionValidation,
  websiteValidation,
  inputValidationMiddleware,
  async (
    req: Request<
      {},
      {},
      { name: string; description: string; websiteUrl: string }
    >,
    res: Response
  ) => {
    const { name, description, websiteUrl } = req.body;

    const createBlog = await blogsService.createBlog(
      name,
      description,
      websiteUrl
    );

    return res.status(201).send(createBlog);
  }
);
// creates new post for specific route
blogsRouter.post(
  "/:blogId/posts",
  basicAuthMiddleware,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  inputValidationMiddleware,
  async (
    req: Request<
      { blogId: string },
      {},
      {
        title: string;
        shortDescription: string;
        content: string;
      }
    >,
    res: Response
  ) => {
    const { title, shortDescription, content } = req.body;
    const blogId = req.params.blogId;
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

blogsRouter.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const blogId = req.params.id;
  const getBlog = await blogsQueryRepository.findBlog(blogId);

  if (!getBlog) {
    return res.sendStatus(404);
  } else {
    return res.status(200).send(getBlog);
  }
});

blogsRouter.put(
  "/:id",
  basicAuthMiddleware,
  nameValidation,
  descriptionValidation,
  websiteValidation,
  inputValidationMiddleware,
  async (
    req: Request<
      { id: string },
      {},
      { name: string; description: string; websiteUrl: string }
    >,
    res: Response
  ) => {
    const blogId = req.params.id;
    const { name, description, websiteUrl } = req.body;
    const getUpdatedBlog = await blogsService.updateBlog(
      blogId,
      name,
      description,
      websiteUrl
    );
    if (!getUpdatedBlog) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
  }
);
blogsRouter.delete(
  "/:id",
  basicAuthMiddleware,
  async (req: Request<{ id: string }>, res: Response) => {
    const blogId = req.params.id;

    const getDeletedBlog = await blogsService.deleteBlog(blogId);

    if (!getDeletedBlog) {
      return res.sendStatus(404);
    }

    return res.sendStatus(204);
  }
);
