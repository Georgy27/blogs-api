"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const posts_repositories_1 = require("../repositories/posts-repositories");
const blogs_repositories_1 = require("../repositories/blogs-repositories");
const basic_auth_middleware_1 = require("../middlewares/basic-auth-middleware");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
exports.postsRouter = (0, express_1.Router)({});
// middlewares
const titleValidation = (0, express_validator_1.body)("title")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 30 });
const shortDescriptionValidation = (0, express_validator_1.body)("shortDescription")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 100 });
const contentValidation = (0, express_validator_1.body)("content")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 1000 });
const blogIdValidation = (0, express_validator_1.body)("blogId")
    .isString()
    .custom((blogId) => {
    const findBlogWithId = blogs_repositories_1.blogsRepository.findBlog(blogId);
    console.log(findBlogWithId);
    if (!findBlogWithId) {
        console.log("I should not be here");
        throw new Error("blog with this id does not exist in the DB");
    }
    else {
        return true;
    }
});
// routes
exports.postsRouter.get("/", (req, res) => {
    const allPosts = posts_repositories_1.postsRepository.findPosts();
    res.status(200).send(allPosts);
});
exports.postsRouter.post("/", basic_auth_middleware_1.basicAuthMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    var _a;
    const { title, shortDescription, content, blogId } = req.body;
    const getBlogName = (_a = blogs_repositories_1.blogsRepository.findBlog(blogId)) === null || _a === void 0 ? void 0 : _a.name;
    const createPost = posts_repositories_1.postsRepository.createPost(title, shortDescription, content, blogId, getBlogName);
    return res.status(201).send(createPost);
});
