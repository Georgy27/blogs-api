import { body } from "express-validator";
import { inject, injectable } from "inversify";
import { BlogsQueryRepository } from "../../../repositories/blogs-db-query-repository";

@injectable()
export class BlogIdValidation {
  constructor(
    @inject(BlogsQueryRepository)
    protected blogsQueryRepository: BlogsQueryRepository
  ) {}
  blogIdValidation = body("blogId")
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
