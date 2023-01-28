import { CommentsRepository } from "../repositories/comments-db-repository";
import { randomUUID } from "crypto";
import { CommentsDBModel, CommentViewModel } from "../models/comments-model";
import { PostsQueryRepository } from "../repositories/posts-db-query-repository";
import { CommentsQueryRepository } from "../repositories/comments-db-query-repository";
import { inject, injectable } from "inversify";

@injectable()
export class CommentsService {
  constructor(
    @inject(CommentsRepository)
    protected commentsRepository: CommentsRepository,
    @inject(PostsQueryRepository)
    protected postsQueryRepository: PostsQueryRepository,
    @inject(CommentsQueryRepository)
    protected commentsQueryRepository: CommentsQueryRepository
  ) {}
  async createComment(
    postId: string,
    comment: string,
    userId: string,
    userLogin: string
  ): Promise<CommentViewModel | null> {
    // check if the post exists
    const isPost = await this.postsQueryRepository.findPost(postId);
    if (!isPost) return null;
    // if it exists, create new comment
    const newComment: CommentsDBModel = {
      id: randomUUID(),
      postId,
      content: comment,
      commentatorInfo: {
        userId: userId,
        userLogin: userLogin,
      },
      createdAt: new Date().toISOString(),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
      },
    };
    // create comment
    return this.commentsRepository.createComment(newComment);
  }
  async updateComment(
    content: string,
    id: string,
    userId: string
  ): Promise<boolean | "404" | "403"> {
    // get comment by Id
    const getCommentById = await this.commentsQueryRepository.findComment(id);
    if (!getCommentById) return "404";
    // check if the comment userId matches the userId of the user that tries to delete the comment
    if (getCommentById.commentatorInfo.userId !== userId) {
      return "403";
    }
    // update the comment
    return this.commentsRepository.updateComment(content, id);
  }
  async deleteComment(
    id: string,
    userId: string
  ): Promise<boolean | "404" | "403"> {
    // get comment by Id
    const getCommentById = await this.commentsQueryRepository.findComment(id);
    if (!getCommentById) return "404";
    // check if the comment userId matches the userId of the user that tries to delete the comment
    if (getCommentById.commentatorInfo.userId !== userId) {
      return "403";
    }
    // delete the comment

    return this.commentsRepository.deleteComment(id);
  }
}
