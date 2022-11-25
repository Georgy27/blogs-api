import { randomUUID } from "crypto";

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
  async findPosts() {
    return posts;
  },
  async createPost(
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
  async findPost(id: string) {
    const getPost = posts.find((post) => {
      return post.id === id;
    });
    return getPost;
  },
  async updatePost(
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
  async deletePost(id: string) {
    const getDeletedPost = posts.filter((post) => {
      return post.id !== id;
    });
    posts = getDeletedPost;
    return posts;
  },
  async clearPosts() {
    posts = [];
  },
};
