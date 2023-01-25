import { Router } from "express";
import { inputValidationMiddleware } from "../middlewares/validation/input-validation-middleware";
import { commentsValidation } from "../middlewares/validation/comments-middleware/content-validation";
import {
  commentsController,
  getUserIdFromAccessToken,
  jwtAuthMiddleware,
} from "../composition-root";
import { likeStatusValidation } from "../middlewares/validation/comments-middleware/likeStatus-validation";

export const commentsRouter = Router({});

const jwtMw = jwtAuthMiddleware.use.bind(jwtAuthMiddleware);
const getUserIdFromAccessTokenMw = getUserIdFromAccessToken.use.bind(
  getUserIdFromAccessToken
);

commentsRouter.get(
  "/:id",
  getUserIdFromAccessTokenMw,
  commentsController.getCommentById.bind(commentsController)
);
commentsRouter.put(
  "/:commentId",
  jwtMw,
  commentsValidation,
  inputValidationMiddleware,
  commentsController.updateCommentById.bind(commentsController)
);
commentsRouter.put(
  "/:commentId/like-status",
  jwtMw,
  likeStatusValidation,
  inputValidationMiddleware,
  commentsController.updateReaction.bind(commentsController)
);
commentsRouter.delete(
  "/:commentId",
  jwtMw,
  commentsController.deleteCommentById.bind(commentsController)
);
