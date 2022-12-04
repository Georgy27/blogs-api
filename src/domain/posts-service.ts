import { randomUUID } from "crypto";
import { IPosts, postsRepository } from "../repositories/posts-db-repository";

export const postsService = {
  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
  ): Promise<IPosts> {
    const newPost = {
      id: randomUUID(),
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
      blogName: blogName,
      createdAt: new Date().toISOString(),
    };
    return postsRepository.createPost(newPost);
  },
  async updatePost(
    postId: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ): Promise<boolean> {
    return postsRepository.updatePost(
      postId,
      title,
      shortDescription,
      content,
      blogId
    );
  },
  async deletePost(id: string): Promise<boolean> {
    return postsRepository.deletePost(id);
  },
};
