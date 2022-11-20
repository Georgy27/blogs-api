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
  findPost(id: string) {
    const getPost = posts.find((post) => {
      return post.id === id;
    });
    return getPost;
  },
  updatePost(
    post: IPosts,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ) {
    post.title = title;
    post.shortDescription = shortDescription;
    post.content = content;
    post.blogId = blogId;
    return post;
  },
  deletePost(id: string) {
    const getDeletedPost = posts.filter((post) => {
      return post.id !== id;
    });
    posts = getDeletedPost;
    return posts;
  },
  clearPosts() {
    posts = [];
  },
};
