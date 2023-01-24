import { body } from "express-validator";
import { BlogsQueryRepository } from "../../../repositories/blogs-db-query-repository";

export class BlogIdValidation {
  constructor(protected blogsQueryRepository: BlogsQueryRepository) {}
  use() {
    body("blogId")
      .isString()
      .custom(async (blogId) => {
        const findBlogWithId = await this.blogsQueryRepository.findBlog(blogId);

        if (!findBlogWithId) {
          throw new Error("blog with this id does not exist in the DB");
        } else {
          return true;
        }
      });
  }
}
