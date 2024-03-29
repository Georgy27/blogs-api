import { RequestWithParams, RequestWithParamsAndBody } from "../types";
import { Response } from "express";
import { CommentsService } from "../domain/comments-service";
import { CommentViewModel } from "../models/comments-model";
import { CommentsQueryRepository } from "../repositories/comments-db-query-repository";
import { ReactionsService } from "../domain/reactions-service";
import { inject, injectable } from "inversify";

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsService) protected commentsService: CommentsService,
    @inject(CommentsQueryRepository)
    protected commentsQueryRepository: CommentsQueryRepository,
    @inject(ReactionsService) protected reactionsService: ReactionsService
  ) {}
  async updateCommentById(
    req: RequestWithParamsAndBody<{ commentId: string }, { content: string }>,
    res: Response
  ) {
    const commentId = req.params.commentId;
    const comment = req.body.content;
    const userId = req.user!.userId;

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
    const userId = req.user ? req.user.userId : null;
    const getCommentById =
      await this.commentsQueryRepository.findCommentWithLikesInfo(
        commentId,
        userId
      );

    if (!getCommentById) {
      return res.sendStatus(404);
    }

    return res.status(200).send(getCommentById);
  }
  async updateReaction(
    req: RequestWithParams<{ commentId: string }>,
    res: Response
  ) {
    const user = req.user!;
    const commentId = req.params.commentId;
    const { likeStatus } = req.body;
    // find comment
    const comment = await this.commentsQueryRepository.findComment(commentId);
    if (!comment) return res.sendStatus(404);
    // update reaction
    const result = await this.reactionsService.updateReaction(
      "comment",
      commentId,
      user.userId,
      user.login,
      likeStatus
    );
    // if (!result) return res.sendStatus(404);
    return res.sendStatus(204);
  }
  async deleteCommentById(
    req: RequestWithParams<{ commentId: string }>,
    res: Response
  ) {
    const commentId = req.params.commentId;
    const userId = req.user!.userId;

    const getDeletedComment = await this.commentsService.deleteComment(
      commentId,
      userId
    );
    if (getDeletedComment === "404") return res.sendStatus(404);
    if (getDeletedComment === "403") return res.sendStatus(403);
    return res.sendStatus(204);
  }
}
