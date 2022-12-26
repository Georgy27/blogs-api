import { Request, Response, Router, NextFunction } from "express";
import { basicAuthMiddleware } from "../middlewares/basic-auth-middleware";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { blogsService } from "../domain/blogs-service";
import { blogsQueryRepository } from "../repositories/blogs-db-query-repository";
import { postsService } from "../domain/posts-service";
import { postsQueryRepository } from "../repositories/posts-db-query-repository";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithParamsAndQuery,
  RequestWithQuery,
} from "../types";
import { CreateBlogModel } from "../models/blogs-model/CreateBlogModel";
import { CreatePostForBLogIdModel } from "../models/blogs-model/CreatePostForBlogIdModel";
import { UpdateBlogModel } from "../models/blogs-model/UpdateBlogModel";
import { QueryBlogModel } from "../models/blogs-model/QueryBlogModel";
import { QueryPostForBlogIdModel } from "../models/blogs-model/QueryPostForBlogIdModel";
import { BlogsViewModel } from "../models/blogs-model/BlogsViewModel";
import { nameValidation } from "../middlewares/blogs-middleware/nameValidation";
import { descriptionValidation } from "../middlewares/blogs-middleware/descriptionValidation";
import { websiteValidation } from "../middlewares/blogs-middleware/websiteValidation";
import {
  pageNumberValidation,
  pageSize,
  sortBy,
} from "../middlewares/sorting&pagination-middleware";
import { contentValidation } from "../middlewares/posts-middleware/contentValidation";
import { titleValidation } from "../middlewares/posts-middleware/titleValidation";
import { shortDescriptionValidation } from "../middlewares/posts-middleware/shortDescriptionValidation";
import { PostsViewModel } from "../models/posts-model/PostsViewModel";
import { BlogsDBModel } from "../models/blogs-model/BlogsDBModel";
import { Pagination } from "../models/pagination.model";
import { morgan } from "../middlewares/morgan-middleware";
export const blogsRouter = Router({});

// routes
blogsRouter.get(
  "/",
  pageSize,
  sortBy,
  pageNumberValidation,
  morgan("tiny"),
  async (
    req: RequestWithQuery<QueryBlogModel>,
    res: Response<Pagination<BlogsViewModel>>
  ) => {
    const { searchNameTerm, sortBy, sortDirection } = req.query;
    const { pageSize, pageNumber } = req.query;
    const allBlogs = await blogsQueryRepository.findBlogs(
      searchNameTerm,
      pageSize,
      sortBy,
      pageNumber,
      sortDirection
    );
    res.status(200).send(allBlogs);
  }
);

// returns all posts for specified blog
blogsRouter.get(
  "/:blogId/posts",
  pageSize,
  sortBy,
  pageNumberValidation,
  morgan("tiny"),
  async (
    req: RequestWithParamsAndQuery<{ blogId: string }, QueryPostForBlogIdModel>,
    res: Response<PostsViewModel>
  ) => {
    const { sortBy, sortDirection } = req.query;
    const { pageSize, pageNumber } = req.query;
    const blogId = req.params.blogId;
    const getBlogById = await blogsQueryRepository.findBlog(blogId);

    if (!getBlogById) {
      return res.sendStatus(404);
    }
    const allPostsWithId = await postsQueryRepository.findPosts(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      blogId
    );
    res.status(200).send(allPostsWithId);
  }
);

blogsRouter.post(
  "/",
  basicAuthMiddleware,
  nameValidation,
  descriptionValidation,
  websiteValidation,
  inputValidationMiddleware,
  morgan("tiny"),
  async (req: RequestWithBody<CreateBlogModel>, res: Response) => {
    const { name, description, websiteUrl } = req.body;

    const createBlog = await blogsService.createBlog(
      name,
      description,
      websiteUrl
    );

    return res.status(201).send(createBlog);
  }
);
// creates new post for specific blog
blogsRouter.post(
  "/:blogId/posts",
  basicAuthMiddleware,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  inputValidationMiddleware,
  morgan("tiny"),
  async (
    req: RequestWithParamsAndBody<{ blogId: string }, CreatePostForBLogIdModel>,
    res: Response
  ) => {
    const { title, shortDescription, content } = req.body;
    const blogId = req.params.blogId;
    const blog = await blogsQueryRepository.findBlog(blogId);

    if (!blog) {
      return res.sendStatus(404);
    }

    const createPost = await postsService.createPost(
      title,
      shortDescription,
      content,
      blogId,
      blog.name
    );

    return res.status(201).send(createPost);
  }
);

blogsRouter.get(
  "/:id",
  morgan("tiny"),
  async (
    req: RequestWithParams<{ id: string }>,
    res: Response<BlogsDBModel>
  ) => {
    const blogId = req.params.id;
    const getBlog = await blogsQueryRepository.findBlog(blogId);

    if (!getBlog) {
      return res.sendStatus(404);
    } else {
      return res.status(200).send(getBlog);
    }
  }
);

blogsRouter.put(
  "/:id",
  basicAuthMiddleware,
  nameValidation,
  descriptionValidation,
  websiteValidation,
  inputValidationMiddleware,
  morgan("tiny"),
  async (
    req: RequestWithParamsAndBody<{ id: string }, UpdateBlogModel>,
    res: Response
  ) => {
    const blogId = req.params.id;
    const { name, description, websiteUrl } = req.body;
    const getUpdatedBlog = await blogsService.updateBlog(
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
);
blogsRouter.delete(
  "/:id",
  basicAuthMiddleware,
  morgan("tiny"),
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const blogId = req.params.id;

    const getDeletedBlog = await blogsService.deleteBlog(blogId);

    if (!getDeletedBlog) {
      return res.sendStatus(404);
    }

    return res.sendStatus(204);
  }
);
