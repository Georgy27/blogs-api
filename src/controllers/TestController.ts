import { Request, Response } from "express";
import { BlogsRepository } from "../repositories/blogs-db-repository";
import { PostsRepository } from "../repositories/posts-db-repository";
import { UsersRepository } from "../repositories/users-db-repository";
import { CommentsRepository } from "../repositories/comments-db-repository";
import { ReactionsRepository } from "../repositories/reactions-db-repository";

export class TestController {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
    protected usersRepository: UsersRepository,
    protected commentsRepository: CommentsRepository,
    protected reactionsRepository: ReactionsRepository
  ) {}
  async dropDatabase(req: Request, res: Response) {
    await this.blogsRepository.clearBlogs();
    await this.postsRepository.clearPosts();
    await this.usersRepository.clearUsers();
    await this.commentsRepository.clearComments();
    await this.reactionsRepository.clearReactions();
    return res.sendStatus(204);
  }
}
