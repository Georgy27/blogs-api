import { Request, Response, Router } from "express";
import { RequestWithParams, RequestWithParamsAndBody } from "../types";
import { commentsQueryRepository } from "../repositories/comments-db-query-repository";
import { jwtAuthMiddleware } from "../middlewares/auth/jwt-auth-middleware";
import { commentsService } from "../domain/comments-service";
import { inputValidationMiddleware } from "../middlewares/validation/input-validation-middleware";
import { commentsValidation } from "../middlewares/validation/comments-middleware/content-validation";
import { CommentViewModel } from "../models/comments-model";

export const commentsRouter = Router({});

commentsRouter.get(
  "/:id",
  async (
    req: RequestWithParams<{ id: string }>,
    res: Response<CommentViewModel>
  ) => {
    const commentId = req.params.id;
    const getCommentById = await commentsQueryRepository.findComment(commentId);

    if (!getCommentById) {
      return res.sendStatus(404);
    }

    return res.status(200).send(getCommentById);
  }
);
commentsRouter.put(
  "/:commentId",
  jwtAuthMiddleware,
  commentsValidation,
  inputValidationMiddleware,
  async (
    req: RequestWithParamsAndBody<{ commentId: string }, { content: string }>,
    res: Response
  ) => {
    const commentId = req.params.commentId;
    const comment = req.body.content;

    const getCommentById = await commentsQueryRepository.findComment(commentId);

    if (!getCommentById) {
      return res.sendStatus(404);
    }

    if (getCommentById.userId !== req.user!.userId) {
      return res.sendStatus(403);
    }

    const getUpdatedComment = await commentsService.updateComment(
      comment,
      commentId
    );
    return res.sendStatus(204);
  }
);
commentsRouter.delete(
  "/:commentId",
  jwtAuthMiddleware,
  async (req: RequestWithParams<{ commentId: string }>, res: Response) => {
    const commentId = req.params.commentId;
    const getCommentById = await commentsQueryRepository.findComment(commentId);

    if (!getCommentById) {
      return res.sendStatus(404);
    }
    if (getCommentById.userId !== req.user!.userId) {
      return res.sendStatus(403);
    }
    const getDeletedComment = await commentsService.deleteComment(commentId);

    return res.sendStatus(204);
  }
);
