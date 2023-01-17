import { Request, Response, Router } from "express";
import { basicAuthMiddleware } from "../middlewares/auth/basic-auth-middleware";
import { inputValidationMiddleware } from "../middlewares/validation/input-validation-middleware";
import { blogsQueryRepository } from "../repositories/blogs-db-query-repository";
import { postsService } from "../domain/posts-service";
import { postsQueryRepository } from "../repositories/posts-db-query-repository";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithParamsAndQuery,
  RequestWithQuery,
} from "../types";
import {
  pageNumberValidation,
  pageSize,
  sortBy,
} from "../middlewares/validation/sorting&pagination-middleware";
import { titleValidation } from "../middlewares/validation/posts-middleware/titleValidation";
import { shortDescriptionValidation } from "../middlewares/validation/posts-middleware/shortDescriptionValidation";
import { contentValidation } from "../middlewares/validation/posts-middleware/contentValidation";
import { blogIdValidation } from "../middlewares/validation/posts-middleware/blogIdValidation";
import { commentsService } from "../domain/comments-service";
import { jwtAuthMiddleware } from "../middlewares/auth/jwt-auth-middleware";
import { commentsQueryRepository } from "../repositories/comments-db-query-repository";
import { commentsValidation } from "../middlewares/validation/comments-middleware/content-validation";
import { Pagination } from "../models/pagination.model";
import { morgan } from "../middlewares/morgan-middleware";
import {
  CreatePostModel,
  QueryPostModel,
  UpdatePostModel,
} from "../models/posts-model";
import { CommentViewModel } from "../models/comments-model";
export const postsRouter = Router({});

// routes
postsRouter.get(
  "/",
  pageSize,
  sortBy,
  pageNumberValidation,
  morgan("tiny"),
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
// returns all comments for specified post
postsRouter.get(
  "/:postId/comments",
  pageSize,
  sortBy,
  pageNumberValidation,
  morgan("tiny"),
  async (
    req: RequestWithParamsAndQuery<{ postId: string }, QueryPostModel>,
    res: Response<Pagination<CommentViewModel>>
  ) => {
    const { sortBy, sortDirection, pageSize, pageNumber } = req.query;
    const postId = req.params.postId;
    const isPost = await postsQueryRepository.findPost(postId);

    if (!isPost) {
      return res.sendStatus(404);
    }
    const allCommentsWithId = await commentsQueryRepository.findComments(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      postId
    );
    res.status(200).send(allCommentsWithId);
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
  morgan("tiny"),
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

// Create new comment
postsRouter.post(
  "/:postId/comments",
  jwtAuthMiddleware,
  commentsValidation,
  inputValidationMiddleware,
  morgan("tiny"),
  async (
    req: RequestWithParamsAndBody<{ postId: string }, { content: string }>,
    res: Response<CommentViewModel>
  ) => {
    const postId = req.params.postId;
    const comment = req.body.content;
    const isPost = await postsQueryRepository.findPost(postId);

    if (!isPost) {
      return res.sendStatus(404);
    }
    const createComment = await commentsService.createComment(
      postId,
      comment,
      req.user!.userId,
      req.user!.login
    );

    return res.status(201).send(createComment);
  }
);
postsRouter.get(
  "/:id",
  morgan("tiny"),
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
  morgan("tiny"),
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
  morgan("tiny"),
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const postId = req.params.id;
    const getDeletedPost = await postsService.deletePost(postId);

    if (!getDeletedPost) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
  }
);
