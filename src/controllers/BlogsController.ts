import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithParamsAndQuery,
  RequestWithQuery,
} from "../types";
import {
  BlogsDBModel,
  BlogsViewModel,
  CreateBlogModel,
  CreatePostForBLogIdModel,
  QueryBlogModel,
  QueryPostForBlogIdModel,
  UpdateBlogModel,
} from "../models/blogs-model";
import { Response } from "express";
import { BlogsService } from "../domain/blogs-service";
import { Pagination } from "../models/pagination.model";
import { BlogsQueryRepository } from "../repositories/blogs-db-query-repository";
import { PostsViewModel } from "../models/posts-model";
import { PostsQueryRepository } from "../repositories/posts-db-query-repository";
import { PostsService } from "../domain/posts-service";

export class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
    protected postsService: PostsService
  ) {}
  async createBlog(req: RequestWithBody<CreateBlogModel>, res: Response) {
    const { name, description, websiteUrl } = req.body;

    const createBlog = await this.blogsService.createBlog(
      name,
      description,
      websiteUrl
    );

    return res.status(201).send(createBlog);
  }
  async updateBlogById(
    req: RequestWithParamsAndBody<{ id: string }, UpdateBlogModel>,
    res: Response
  ) {
    const blogId = req.params.id;
    const { name, description, websiteUrl } = req.body;
    const getUpdatedBlog = await this.blogsService.updateBlog(
      blogId,
      name,
      description,
      websiteUrl
    );
    if (!getUpdatedBlog) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
  }
  async getAllBlogs(
    req: RequestWithQuery<QueryBlogModel>,
    res: Response<Pagination<BlogsViewModel>>
  ) {
    const { searchNameTerm, sortBy, sortDirection } = req.query;
    const { pageSize, pageNumber } = req.query;
    const allBlogs = await this.blogsQueryRepository.findBlogs(
      searchNameTerm,
      pageSize,
      sortBy,
      pageNumber,
      sortDirection
    );
    res.status(200).send(allBlogs);
  }
  async getBlogById(
    req: RequestWithParams<{ id: string }>,
    res: Response<BlogsDBModel>
  ) {
    const blogId = req.params.id;
    const getBlog = await this.blogsQueryRepository.findBlog(blogId);

    if (!getBlog) {
      return res.sendStatus(404);
    } else {
      return res.status(200).send(getBlog);
    }
  }
  async deleteBlogById(req: RequestWithParams<{ id: string }>, res: Response) {
    const blogId = req.params.id;

    const getDeletedBlog = await this.blogsService.deleteBlog(blogId);

    if (!getDeletedBlog) {
      return res.sendStatus(404);
    }

    return res.sendStatus(204);
  }
  async getAllPostsForSpecifiedBlog(
    req: RequestWithParamsAndQuery<{ blogId: string }, QueryPostForBlogIdModel>,
    res: Response<PostsViewModel>
  ) {
    const { sortBy, sortDirection } = req.query;
    const { pageSize, pageNumber } = req.query;
    const blogId = req.params.blogId;
    const getBlogById = await this.blogsQueryRepository.findBlog(blogId);

    if (!getBlogById) {
      return res.sendStatus(404);
    }
    const allPostsWithId = await this.postsQueryRepository.findPosts(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      blogId
    );
    res.status(200).send(allPostsWithId);
  }
  async createPostForSpecifiedBlog(
    req: RequestWithParamsAndBody<{ blogId: string }, CreatePostForBLogIdModel>,
    res: Response
  ) {
    const { title, shortDescription, content } = req.body;
    const blogId = req.params.blogId;
    const newPostForBlogId = await this.postsService.createPost(
      blogId,
      title,
      shortDescription,
      content
    );

    if (!newPostForBlogId) {
      return res.sendStatus(404);
    }

    return res.status(201).send(newPostForBlogId);
  }
}
