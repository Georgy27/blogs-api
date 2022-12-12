import { Request, Response, Router } from "express";
import { body, query } from "express-validator";
import { basicAuthMiddleware } from "../middlewares/basic-auth-middleware";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { blogsQueryRepository } from "../repositories/blogs-db-query-repository";
import { postsService } from "../domain/posts-service";
import { postsQueryRepository } from "../repositories/posts-db-query-repository";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../types";
import { CreatePostModel } from "../models/posts-model/CreatePostModel";
import { QueryPostModel } from "../models/posts-model/QueryPostModel";
import { UpdatePostModel } from "../models/posts-model/UpdatePostModel";
import {
  pageNumberValidation,
  pageSize,
  sortBy,
} from "../middlewares/sorting&pagination-middleware";
import { titleValidation } from "../middlewares/posts-middleware/titleValidation";
import { shortDescriptionValidation } from "../middlewares/posts-middleware/shortDescriptionValidation";
import { contentValidation } from "../middlewares/posts-middleware/contentValidation";
import { blogIdValidation } from "../middlewares/posts-middleware/blogIdValidation";
export const postsRouter = Router({});

// routes
postsRouter.get(
  "/",
  pageSize,
  sortBy,
  pageNumberValidation,
  async (req: RequestWithQuery<QueryPostModel>, res: Response) => {
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
  async (req: RequestWithBody<CreatePostModel>, res: Response) => {
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
postsRouter.get(
  "/:id",
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const postId = req.params.id;
    const getPost = await postsQueryRepository.findPost(postId);

    if (!getPost) {
      return res.sendStatus(404);
    } else {
      return res.status(200).send(getPost);
    }
  }
);
postsRouter.put(
  "/:id",
  basicAuthMiddleware,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
  inputValidationMiddleware,
  async (
    req: RequestWithParamsAndBody<{ id: string }, UpdatePostModel>,
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
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const postId = req.params.id;
    const getDeletedPost = await postsService.deletePost(postId);

    if (!getDeletedPost) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
  }
);
