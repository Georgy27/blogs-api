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

export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected postsQueryRepository: PostsQueryRepository,
    protected commentsService: CommentsService,
    protected commentsQueryRepository: CommentsQueryRepository
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
    const allPosts = await this.postsQueryRepository.findPosts(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection
    );
    res.status(200).send(allPosts);
  }
  async getPostById(req: RequestWithParams<{ id: string }>, res: Response) {
    const postId = req.params.id;
    const getPost = await this.postsQueryRepository.findPost(postId);

    if (!getPost) {
      return res.sendStatus(404);
    } else {
      return res.status(200).send(getPost);
    }
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
    // req: RequestWithParamsAndQuery<{ postId: string }, QueryPostModel>,
    req: any,
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
