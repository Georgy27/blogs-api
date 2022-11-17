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
    deleteBlog(id) {
        const getDeletedBlog = exports.blogs.find((blog) => {
            return blog.id === id;
        });
        return getDeletedBlog;
    },
};
