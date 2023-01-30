import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithParamsAndQuery,
  RequestWithQuery,
} from "../types";
import {
  CreatePostModel,
  QueryPostModel,
  UpdatePostModel,
} from "../models/posts-model";
import { Response } from "express";
import { PostsQueryRepository } from "../repositories/posts-db-query-repository";
import { PostsService } from "../domain/posts-service";
import { CommentViewModel } from "../models/comments-model";
import { CommentsService } from "../domain/comments-service";
import { Pagination } from "../models/pagination.model";
import { CommentsQueryRepository } from "../repositories/comments-db-query-repository";
import { inject, injectable } from "inversify";
import { ReactionsService } from "../domain/reactions-service";

@injectable()
export class PostsController {
  constructor(
    @inject(PostsService) protected postsService: PostsService,
    @inject(PostsQueryRepository)
    protected postsQueryRepository: PostsQueryRepository,
    @inject(CommentsService) protected commentsService: CommentsService,
    @inject(CommentsQueryRepository)
    protected commentsQueryRepository: CommentsQueryRepository,
    @inject(ReactionsService) protected reactionsService: ReactionsService
  ) {}
  async createPost(req: RequestWithBody<CreatePostModel>, res: Response) {
    const { title, shortDescription, content, blogId } = req.body;
    const newPost = await this.postsService.createPost(
      blogId,
      title,
      shortDescription,
      content
    );

    if (!newPost) {
      return res.sendStatus(404);
    }

    return res.status(201).send(newPost);
  }
  async updatePost(
    req: RequestWithParamsAndBody<{ id: string }, UpdatePostModel>,
    res: Response
  ) {
    const postId = req.params.id;
    const { title, shortDescription, content, blogId } = req.body;
    const getUpdatedPost = await this.postsService.updatePost(
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
  async getAllPosts(req: RequestWithQuery<QueryPostModel>, res: Response) {
    const { sortBy, sortDirection } = req.query;
    const { pageSize, pageNumber } = req.query;
    const user = req.user ? req.user : null;
    const allPosts = await this.postsQueryRepository.findPosts(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      user
    );
    res.status(200).send(allPosts);
  }
  async getPostById(req: RequestWithParams<{ id: string }>, res: Response) {
    const postId = req.params.id;
    const user = req.user ? req.user : null;
    const getPost = await this.postsQueryRepository.findPostWithLikesInfo(
      postId,
      user
    );

    if (!getPost) {
      return res.sendStatus(404);
    } else {
      return res.status(200).send(getPost);
    }
  }
  async updateReaction(
    req: RequestWithParams<{ postId: string }>,
    res: Response
  ) {
    const user = req.user!;
    const postId = req.params.postId;
    const { likeStatus } = req.body;
    // find post
    const post = await this.postsQueryRepository.findPost(postId);
    if (!post) return res.sendStatus(404);
    // update reaction
    const result = await this.reactionsService.updateReaction(
      "post",
      postId,
      user.userId,
      user.login,
      likeStatus
    );
    return res.sendStatus(204);
  }
  async deletePostById(req: RequestWithParams<{ id: string }>, res: Response) {
    const postId = req.params.id;
    const getDeletedPost = await this.postsService.deletePost(postId);

    if (!getDeletedPost) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
  }
  async createCommentForSpecifiedPost(
    req: RequestWithParamsAndBody<{ postId: string }, { content: string }>,
    res: Response<CommentViewModel>
  ) {
    const postId = req.params.postId;
    const comment = req.body.content;

    const newComment = await this.commentsService.createComment(
      postId,
      comment,
      req.user!.userId,
      req.user!.login
    );

    if (!newComment) {
      return res.sendStatus(404);
    }

    return res.status(201).send(newComment);
  }
  async getAllCommentsForSpecifiedPost(
    req: RequestWithParamsAndQuery<{ postId: string }, QueryPostModel>,
    res: Response<Pagination<CommentViewModel>>
  ) {
    const { sortBy, sortDirection, pageSize, pageNumber } = req.query;
    const userId = req.user ? req.user.userId : null;
    // find post
    const postId = req.params.postId;
    const isPost = await this.postsQueryRepository.findPost(postId);

    if (!isPost) {
      return res.sendStatus(404);
    }

    const allCommentsWithId = await this.commentsQueryRepository.findComments(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      postId,
      userId
    );

    return res.status(200).send(allCommentsWithId);
  }
}
