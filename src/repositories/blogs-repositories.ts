import { randomUUID } from "crypto";

interface IBlogs {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
}
export let blogs: IBlogs[] = [];

export const blogsRepository = {
  findBlogs() {
    return blogs;
  },
  createBlog(name: string, description: string, websiteUrl: string) {
    const newBlog = {
      id: randomUUID(),
      name: name,
      description: description,
      websiteUrl: websiteUrl,
    };
    blogs.push(newBlog);
    return newBlog;
  },
  findBlog(id: string) {
    const getBlog = blogs.find((blog) => {
      return blog.id === id;
    });
    return getBlog;
  },
  deleteBlog(id: string) {
    const getDeletedBlog = blogs.find((blog) => {
      return blog.id === id;
    });
    return getDeletedBlog;
  },
};
