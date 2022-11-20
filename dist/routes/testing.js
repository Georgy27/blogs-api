"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const blogs_repositories_1 = require("../repositories/blogs-repositories");
const posts_repositories_1 = require("../repositories/posts-repositories");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter.delete("/", (req, res) => {
    const clearAllBlogs = blogs_repositories_1.blogsRepository.clearBlogs();
    const clearAllPosts = posts_repositories_1.postsRepository.clearPosts();
    return res.sendStatus(204);
});
