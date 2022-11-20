import { randomUUID } from "crypto";
import { blogs } from "./blogs-repositories";

interface IPosts {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
}
let posts: IPosts[] = [];

export const postsRepository = {
  findPosts() {
    return posts;
  },
  createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
  ) {
    const newPost = {
      id: randomUUID(),
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
      blogName: blogName,
    };
    posts.push(newPost);
    return newPost;
  },
  clearPosts() {
    posts = [];
  },
};
