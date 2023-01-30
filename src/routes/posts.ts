import { Router } from "express";
import { basicAuthMiddleware } from "../middlewares/auth/basic-auth-middleware";
import { inputValidationMiddleware } from "../middlewares/validation/input-validation-middleware";
import {
  pageNumberValidation,
  pageSize,
  sortBy,
} from "../middlewares/validation/sorting&pagination-middleware";
import { titleValidation } from "../middlewares/validation/posts-middleware/titleValidation";
import { shortDescriptionValidation } from "../middlewares/validation/posts-middleware/shortDescriptionValidation";
import { contentValidation } from "../middlewares/validation/posts-middleware/contentValidation";
import { commentsValidation } from "../middlewares/validation/comments-middleware/content-validation";
import { morgan } from "../middlewares/morgan-middleware";
import { container } from "../composition-root";
import { PostsController } from "../controllers/PostsController";
import {
  GetUserIdFromAccessToken,
  JwtAuthMiddleware,
} from "../middlewares/auth/jwt-auth-middleware";
import { BlogIdValidation } from "../middlewares/validation/posts-middleware/blogIdValidation";
import { likeStatusValidation } from "../middlewares/validation/comments-middleware/likeStatus-validation";

export const postsRouter = Router({});
const postsController = container.resolve(PostsController);
const jwtMw = container.resolve(JwtAuthMiddleware);
const getUserIdFromAccessTokenMw = container.resolve(GetUserIdFromAccessToken);
const blogIdValidation = container.resolve(BlogIdValidation);
// routes
postsRouter.get(
  "/",
  pageSize,
  sortBy,
  pageNumberValidation,
  getUserIdFromAccessTokenMw.use.bind(getUserIdFromAccessTokenMw),
  morgan("tiny"),
  postsController.getAllPosts.bind(postsController)
);
postsRouter.get(
  "/:postId/comments",
  pageSize,
  sortBy,
  pageNumberValidation,
  getUserIdFromAccessTokenMw.use.bind(getUserIdFromAccessTokenMw),
  morgan("tiny"),
  postsController.getAllCommentsForSpecifiedPost.bind(postsController)
);
postsRouter.post(
  "/",
  basicAuthMiddleware,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation.blogIdValidation.bind(blogIdValidation),
  inputValidationMiddleware,
  morgan("tiny"),
  postsController.createPost.bind(postsController)
);
postsRouter.post(
  "/:postId/comments",
  jwtMw.use.bind(jwtMw),
  commentsValidation,
  inputValidationMiddleware,
  morgan("tiny"),
  postsController.createCommentForSpecifiedPost.bind(postsController)
);
postsRouter.get(
  "/:id",
  getUserIdFromAccessTokenMw.use.bind(getUserIdFromAccessTokenMw),
  morgan("tiny"),
  postsController.getPostById.bind(postsController)
);
postsRouter.put(
  "/:id",
  basicAuthMiddleware,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation.blogIdValidation.bind(blogIdValidation),
  inputValidationMiddleware,
  morgan("tiny"),
  postsController.updatePost.bind(postsController)
);
postsRouter.put(
  "/:postId/like-status",
  jwtMw.use.bind(jwtMw),
  likeStatusValidation,
  inputValidationMiddleware,
  postsController.updateReaction.bind(postsController)
);
postsRouter.delete(
  "/:id",
  basicAuthMiddleware,
  morgan("tiny"),
  postsController.deletePostById.bind(postsController)
);
