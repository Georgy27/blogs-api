import { Request, Response, Router } from "express";
import addDays from "date-fns/addDays";
import { body } from "express-validator";
import { postsRepository } from "../repositories/posts-db-repository";
import { blogsRepository } from "../repositories/blogs-db-repository";
import { basicAuthMiddleware } from "../middlewares/basic-auth-middleware";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
export const postsRouter = Router({});

// middlewares
const titleValidation = body("title")
  .isString()
  .trim()
  .notEmpty()
  .isLength({ max: 30 });
const shortDescriptionValidation = body("shortDescription")
  .isString()
  .trim()
  .notEmpty()
  .isLength({ max: 100 });
const contentValidation = body("content")
  .isString()
  .trim()
  .notEmpty()
  .isLength({ max: 1000 });
const blogIdValidation = body("blogId")
  .isString()
  .custom(async (blogId) => {
    const findBlogWithId = await blogsRepository.findBlog(blogId);

    if (!findBlogWithId) {
      throw new Error("blog with this id does not exist in the DB");
    } else {
      return true;
    }
  });

// routes
postsRouter.get("/", async (req: Request, res: Response) => {
  const allPosts = await postsRepository.findPosts();
  res.status(200).send(allPosts);
});
postsRouter.post(
  "/",
  basicAuthMiddleware,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
  inputValidationMiddleware,
  async (
    req: Request<
      {},
      {},
      {
        title: string;
        shortDescription: string;
        content: string;
        blogId: string;
      }
    >,
    res: Response
  ) => {
    const { title, shortDescription, content, blogId } = req.body;
    const blog = await blogsRepository.findBlog(blogId);

    if (!blog) {
      return res.sendStatus(404);
    }

    const createPost = await postsRepository.createPost(
      title,
      shortDescription,
      content,
      blogId,
      blog.name
    );

    return res.status(201).send(createPost);
  }
);
postsRouter.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const postId = req.params.id;
  const getPost = await postsRepository.findPost(postId);

  if (!getPost) {
    return res.sendStatus(404);
  } else {
    return res.status(200).send(getPost);
  }
});
postsRouter.put(
  "/:id",
  basicAuthMiddleware,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
  inputValidationMiddleware,
  async (
    req: Request<
      { id: string },
      {},
      {
        title: string;
        shortDescription: string;
        content: string;
        blogId: string;
      }
    >,
    res: Response
  ) => {
    const postId = req.params.id;
    const { title, shortDescription, content, blogId } = req.body;

    const getUpdatedPost = await postsRepository.updatePost(
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
);
postsRouter.delete(
  "/:id",
  basicAuthMiddleware,
  async (req: Request<{ id: string }>, res: Response) => {
    const postId = req.params.id;

    const getDeletedPost = await postsRepository.deletePost(postId);

    if (!getDeletedPost) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
  }
);
