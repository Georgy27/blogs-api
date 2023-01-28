import { Router } from "express";
import { basicAuthMiddleware } from "../middlewares/auth/basic-auth-middleware";
import { inputValidationMiddleware } from "../middlewares/validation/input-validation-middleware";
import { nameValidation } from "../middlewares/validation/blogs-middleware/nameValidation";
import { descriptionValidation } from "../middlewares/validation/blogs-middleware/descriptionValidation";
import { websiteValidation } from "../middlewares/validation/blogs-middleware/websiteValidation";
import {
  pageNumberValidation,
  pageSize,
  sortBy,
} from "../middlewares/validation/sorting&pagination-middleware";
import { contentValidation } from "../middlewares/validation/posts-middleware/contentValidation";
import { titleValidation } from "../middlewares/validation/posts-middleware/titleValidation";
import { shortDescriptionValidation } from "../middlewares/validation/posts-middleware/shortDescriptionValidation";
import { morgan } from "../middlewares/morgan-middleware";
import { container } from "../composition-root";
import { BlogsController } from "../controllers/BlogsController";

const blogsController = container.resolve(BlogsController);

export const blogsRouter = Router({});
// routes
blogsRouter.get(
  "/",
  pageSize,
  sortBy,
  pageNumberValidation,
  morgan("tiny"),
  blogsController.getAllBlogs.bind(blogsController)
);
blogsRouter.get(
  "/:blogId/posts",
  pageSize,
  sortBy,
  pageNumberValidation,
  morgan("tiny"),
  blogsController.getAllPostsForSpecifiedBlog.bind(blogsController)
);
blogsRouter.post(
  "/",
  basicAuthMiddleware,
  nameValidation,
  descriptionValidation,
  websiteValidation,
  inputValidationMiddleware,
  morgan("tiny"),
  blogsController.createBlog.bind(blogsController)
);
blogsRouter.post(
  "/:blogId/posts",
  basicAuthMiddleware,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  inputValidationMiddleware,
  morgan("tiny"),
  blogsController.createPostForSpecifiedBlog.bind(blogsController)
);
blogsRouter.get(
  "/:id",
  morgan("tiny"),
  blogsController.getBlogById.bind(blogsController)
);
blogsRouter.put(
  "/:id",
  basicAuthMiddleware,
  nameValidation,
  descriptionValidation,
  websiteValidation,
  inputValidationMiddleware,
  morgan("tiny"),
  blogsController.updateBlogById.bind(blogsController)
);
blogsRouter.delete(
  "/:id",
  basicAuthMiddleware,
  morgan("tiny"),
  blogsController.deleteBlogById.bind(blogsController)
);
