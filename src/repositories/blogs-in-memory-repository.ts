import { randomUUID } from "crypto";

interface IBlogs {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
}
export let blogs: IBlogs[] = [];

export const blogsRepository = {
  async findBlogs() {
    return blogs;
  },
  async createBlog(name: string, description: string, websiteUrl: string) {
    const newBlog = {
      id: randomUUID(),
      name: name,
      description: description,
      websiteUrl: websiteUrl,
    };
    blogs.push(newBlog);
    return newBlog;
  },
  async findBlog(id: string): Promise<IBlogs | undefined> {
    const getBlog = blogs.find((blog) => {
      return blog.id === id;
    });
    return getBlog;
  },
  async updateBlog(
    blog: IBlogs,
    name: string,
    description: string,
    websiteUrl: string
  ) {
    blog.name = name;
    blog.description = description;
    blog.websiteUrl = websiteUrl;
    return blog;
  },
  async deleteBlog(id: string) {
    const getDeletedBlog = blogs.filter((blog) => {
      return blog.id !== id;
    });
    blogs = getDeletedBlog;
    return blogs;
  },
  async clearBlogs() {
    blogs = [];
  },
};
