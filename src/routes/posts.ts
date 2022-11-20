import { Request, Response, Router } from "express";
import addDays from "date-fns/addDays";
import { body } from "express-validator";
import { postsRepository } from "../repositories/posts-repositories";
import { blogsRepository } from "../repositories/blogs-repositories";
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
  .custom((blogId) => {
    const findBlogWithId = blogsRepository.findBlog(blogId);

    if (!findBlogWithId) {
      throw new Error("blog with this id does not exist in the DB");
    } else {
      return true;
    }
  });

// routes
postsRouter.get("/", (req: Request, res: Response) => {
  const allPosts = postsRepository.findPosts();
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
  (
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
    const getBlogName = blogsRepository.findBlog(blogId)?.name;
    const createPost = postsRepository.createPost(
      title,
      shortDescription,
      content,
      blogId,
      getBlogName as string
    );

    return res.status(201).send(createPost);
  }
);
postsRouter.get("/:id", (req: Request<{ id: string }>, res: Response) => {
  const postId = req.params.id;
  const getPost = postsRepository.findPost(postId);

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
  (
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
    const getPost = postsRepository.findPost(postId);
    // const getBlogName = blogsRepository.findBlog(blogId)?.name;

    if (!getPost) {
      return res.sendStatus(404);
    } else {
      const getUpdatedPost = postsRepository.updatePost(
        getPost,
        title,
        shortDescription,
        content,
        blogId
      );
      return res.sendStatus(204);
    }
  }
);
postsRouter.delete(
  "/:id",
  basicAuthMiddleware,
  (req: Request<{ id: string }>, res: Response) => {
    const postId = req.params.id;
    const getPost = postsRepository.findPost(postId);

    if (!getPost) {
      return res.sendStatus(404);
    } else {
      const getDeletedPost = postsRepository.deletePost(postId);
      return res.sendStatus(204);
    }
  }
);
