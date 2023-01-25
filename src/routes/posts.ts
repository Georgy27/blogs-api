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
import {
  getUserIdFromAccessToken,
  jwtAuthMiddleware,
  postsController,
} from "../composition-root";
import { blogIdValidation } from "../middlewares/validation/posts-middleware/blogIdValidation";

export const postsRouter = Router({});
const jwtMw = jwtAuthMiddleware.use.bind(jwtAuthMiddleware);
const getUserIdFromAccessTokenMw = getUserIdFromAccessToken.use.bind(
  getUserIdFromAccessToken
);
// routes
postsRouter.get(
  "/",
  pageSize,
  sortBy,
  pageNumberValidation,
  morgan("tiny"),
  postsController.getAllPosts.bind(postsController)
);
postsRouter.get(
  "/:postId/comments",
  pageSize,
  sortBy,
  pageNumberValidation,
  getUserIdFromAccessTokenMw,
  morgan("tiny"),
  postsController.getAllCommentsForSpecifiedPost.bind(postsController)
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
  postsController.createPost.bind(postsController)
);
postsRouter.post(
  "/:postId/comments",
  jwtMw,
  commentsValidation,
  inputValidationMiddleware,
  morgan("tiny"),
  postsController.createCommentForSpecifiedPost.bind(postsController)
);
postsRouter.get(
  "/:id",
  morgan("tiny"),
  postsController.getPostById.bind(postsController)
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
  postsController.updatePost.bind(postsController)
);
postsRouter.delete(
  "/:id",
  basicAuthMiddleware,
  morgan("tiny"),
  postsController.deletePostById.bind(postsController)
);
