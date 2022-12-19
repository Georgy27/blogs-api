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
  RequestWithParamsAndQuery,
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
import { commentsService } from "../domain/comments-service";
import { jwtAuthMiddleware } from "../middlewares/jwt-auth-middleware";
import { AuthViewModel } from "../models/auth-model/AuthViewModel";
import { CommentsDBModel } from "../models/comments-model/CommentsDBModel";
import { commentsQueryRepository } from "../repositories/comments-db-query-repository";
import { commentsValidation } from "../middlewares/comments-middleware/content-validation";
import { CommentViewModel } from "../models/comments-model/CommentsViewModel";
import { Pagination } from "../models/pagination.model";
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
// returns all comments for specified post
postsRouter.get(
  "/:postId/comments",
  pageSize,
  sortBy,
  pageNumberValidation,
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
