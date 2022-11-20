import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { blogsRepository } from "../repositories/blogs-repositories";
import { basicAuthMiddleware } from "../middlewares/basic-auth-middleware";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
export const blogsRouter = Router({});

// middlewares
const nameValidation = body("name")
  .isString()
  .trim()
  .notEmpty()
  .isLength({ max: 15 })
  .withMessage("name can not be longer than 15 characters");
const descriptionValidation = body("description")
  .isString()
  .trim()
  .notEmpty()
  .isLength({ max: 500 });
const websiteValidation = body("websiteUrl")
  .isLength({ max: 100 })
  .matches(
    "^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$"
  );

// routes
blogsRouter.get("/", (req: Request, res: Response) => {
  const allBlogs = blogsRepository.findBlogs();
  res.status(200).send(allBlogs);
});

blogsRouter.post(
  "/",
  basicAuthMiddleware,
  nameValidation,
  descriptionValidation,
  websiteValidation,
  inputValidationMiddleware,
  (
    req: Request<
      {},
      {},
      { name: string; description: string; websiteUrl: string }
    >,
    res: Response
  ) => {
    const { name, description, websiteUrl } = req.body;

    const createBlog = blogsRepository.createBlog(
      name,
      description,
      websiteUrl
    );

    return res.status(201).send(createBlog);
  }
);

blogsRouter.get("/:id", (req: Request<{ id: string }>, res: Response) => {
  const blogId = req.params.id;
  const getBlog = blogsRepository.findBlog(blogId);

  if (!getBlog) {
    return res.sendStatus(404);
  } else {
    return res.status(200).send(getBlog);
  }
});

blogsRouter.put(
  "/:id",
  basicAuthMiddleware,
  nameValidation,
  descriptionValidation,
  websiteValidation,
  inputValidationMiddleware,
  (
    req: Request<
      { id: string },
      {},
      { name: string; description: string; websiteUrl: string }
    >,
    res: Response
  ) => {
    const blogId = req.params.id;
    const { name, description, websiteUrl } = req.body;
    const getBlog = blogsRepository.findBlog(blogId);

    if (!getBlog) {
      return res.sendStatus(404);
    } else {
      const getUpdatedBlog = blogsRepository.updateBlog(
        getBlog,
        name,
        description,
        websiteUrl
      );
      return res.sendStatus(204);
    }
  }
);
blogsRouter.delete(
  "/:id",
  basicAuthMiddleware,
  (req: Request<{ id: string }>, res: Response) => {
    const blogId = req.params.id;
    const getBlog = blogsRepository.findBlog(blogId);

    if (!getBlog) {
      return res.sendStatus(404);
    } else {
      const getDeletedBlog = blogsRepository.deleteBlog(blogId);
      return res.sendStatus(204);
    }
  }
);
