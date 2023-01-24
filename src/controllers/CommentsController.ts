import { RequestWithParams, RequestWithParamsAndBody } from "../types";
import { Response } from "express";
import { CommentsService } from "../domain/comments-service";
import { CommentViewModel } from "../models/comments-model";
import { CommentsQueryRepository } from "../repositories/comments-db-query-repository";

export class CommentsController {
  constructor(
    protected commentsService: CommentsService,
    protected commentsQueryRepository: CommentsQueryRepository
  ) {}
  async updateCommentById(
    req: RequestWithParamsAndBody<{ commentId: string }, { content: string }>,
    res: Response
  ) {
    const commentId = req.params.commentId;
    const comment = req.body.content;
    const userId = req.user.userId;

    const getUpdatedComment = await this.commentsService.updateComment(
      comment,
      commentId,
      userId
    );
    if (getUpdatedComment === "404") return res.sendStatus(404);
    if (getUpdatedComment === "403") return res.sendStatus(403);
    return res.sendStatus(204);
  }
  async getCommentById(
    req: RequestWithParams<{ id: string }>,
    res: Response<CommentViewModel>
  ) {
    const commentId = req.params.id;
    const getCommentById = await this.commentsQueryRepository.findComment(
      commentId
    );

    if (!getCommentById) {
      return res.sendStatus(404);
    }

    return res.status(200).send(getCommentById);
  }
  async deleteCommentById(
    req: RequestWithParams<{ commentId: string }>,
    res: Response
  ) {
    const commentId = req.params.commentId;
    const userId = req.user.userId;

    const getDeletedComment = await this.commentsService.deleteComment(
      commentId,
      userId
    );
    if (getDeletedComment === "404") return res.sendStatus(404);
    if (getDeletedComment === "403") return res.sendStatus(403);
    return res.sendStatus(204);
  }
}
