"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = exports.blogs = void 0;
const crypto_1 = require("crypto");
exports.blogs = [];
exports.blogsRepository = {
    findBlogs() {
        return exports.blogs;
    },
    createBlog(name, description, websiteUrl) {
        const newBlog = {
            id: (0, crypto_1.randomUUID)(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
        };
        exports.blogs.push(newBlog);
        return newBlog;
    },
    findBlog(id) {
        const getBlog = exports.blogs.find((blog) => {
            return blog.id === id;
        });
        return getBlog;
    },
    updateBlog(blog, name, description, websiteUrl) {
        blog.name = name;
        blog.description = description;
        blog.websiteUrl = websiteUrl;
        return blog;
    },
    deleteBlog(id) {
        const getDeletedBlog = exports.blogs.filter((blog) => {
            return blog.id !== id;
        });
        exports.blogs = getDeletedBlog;
        return exports.blogs;
    },
    clearBlogs() {
        exports.blogs = [];
    },
};
