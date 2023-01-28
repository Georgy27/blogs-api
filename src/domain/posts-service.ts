import { randomUUID } from "crypto";
import { PostsDBModel } from "../models/posts-model";
import { PostsRepository } from "../repositories/posts-db-repository";
import { BlogsQueryRepository } from "../repositories/blogs-db-query-repository";
import { inject, injectable } from "inversify";

@injectable()
export class PostsService {
  constructor(
    @inject(PostsRepository) protected postsRepository: PostsRepository,
    @inject(BlogsQueryRepository)
    protected blogsQueryRepository: BlogsQueryRepository
  ) {}
  async createPost(
    blogId: string,
    title: string,
    shortDescription: string,
    content: string
  ): Promise<PostsDBModel | null> {
    // get blog
    const blog = await this.blogsQueryRepository.findBlog(blogId);
    if (!blog) return null;
    // create a post for specified blog
    const newPost = {
      id: randomUUID(),
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };
    return this.postsRepository.createPost(newPost);
  }
  async updatePost(
    postId: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ): Promise<boolean> {
    return this.postsRepository.updatePost(
      postId,
      title,
      shortDescription,
      content,
      blogId
    );
  }
  async deletePost(id: string): Promise<boolean> {
    return this.postsRepository.deletePost(id);
  }
}
