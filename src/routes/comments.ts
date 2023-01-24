import { Router } from "express";
import { inputValidationMiddleware } from "../middlewares/validation/input-validation-middleware";
import { commentsValidation } from "../middlewares/validation/comments-middleware/content-validation";
import { commentsController, jwtAuthMiddleware } from "../composition-root";

export const commentsRouter = Router({});

const jwtMw = jwtAuthMiddleware.use.bind(jwtAuthMiddleware);

commentsRouter.get(
  "/:id",
  commentsController.getCommentById.bind(commentsController)
);
commentsRouter.put(
  "/:commentId",
  jwtMw,
  commentsValidation,
  inputValidationMiddleware,
  commentsController.updateCommentById.bind(commentsController)
);
commentsRouter.delete(
  "/:commentId",
  jwtMw,
  commentsController.deleteCommentById.bind(commentsController)
);
