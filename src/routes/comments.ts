import { Router } from "express";
import { inputValidationMiddleware } from "../middlewares/validation/input-validation-middleware";
import { commentsValidation } from "../middlewares/validation/comments-middleware/content-validation";
import { likeStatusValidation } from "../middlewares/validation/comments-middleware/likeStatus-validation";
import { container } from "../composition-root";
import { CommentsController } from "../controllers/CommentsController";
import {
  GetUserIdFromAccessToken,
  JwtAuthMiddleware,
} from "../middlewares/auth/jwt-auth-middleware";

export const commentsRouter = Router({});
const commentsController = container.resolve(CommentsController);
const jwtMw = container.resolve(JwtAuthMiddleware);
const getUserIdFromAccessTokenMw = container.resolve(GetUserIdFromAccessToken);

commentsRouter.get(
  "/:id",
  getUserIdFromAccessTokenMw.use.bind(getUserIdFromAccessTokenMw),
  commentsController.getCommentById.bind(commentsController)
);
commentsRouter.put(
  "/:commentId",
  jwtMw.use.bind(jwtMw),
  commentsValidation,
  inputValidationMiddleware,
  commentsController.updateCommentById.bind(commentsController)
);
commentsRouter.put(
  "/:commentId/like-status",
  jwtMw.use.bind(jwtMw),
  likeStatusValidation,
  inputValidationMiddleware,
  commentsController.updateReaction.bind(commentsController)
);
commentsRouter.delete(
  "/:commentId",
  jwtMw.use.bind(jwtMw),
  commentsController.deleteCommentById.bind(commentsController)
);
