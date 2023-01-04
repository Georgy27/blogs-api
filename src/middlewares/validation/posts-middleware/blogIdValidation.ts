import { body } from "express-validator";
import { blogsQueryRepository } from "../../../repositories/blogs-db-query-repository";

export const blogIdValidation = body("blogId")
  .isString()
  .custom(async (blogId) => {
    const findBlogWithId = await blogsQueryRepository.findBlog(blogId);

    if (!findBlogWithId) {
      throw new Error("blog with this id does not exist in the DB");
    } else {
      return true;
    }
  });
