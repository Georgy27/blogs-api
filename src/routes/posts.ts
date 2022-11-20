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
    console.log(findBlogWithId);
    if (!findBlogWithId) {
      console.log("I should not be here");
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
