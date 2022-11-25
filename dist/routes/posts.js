"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const posts_db_repository_1 = require("../repositories/posts-db-repository");
const blogs_db_repository_1 = require("../repositories/blogs-db-repository");
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
    .custom((blogId) => __awaiter(void 0, void 0, void 0, function* () {
    const findBlogWithId = yield blogs_db_repository_1.blogsRepository.findBlog(blogId);
    if (!findBlogWithId) {
        throw new Error("blog with this id does not exist in the DB");
    }
    else {
        return true;
    }
}));
// routes
exports.postsRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allPosts = yield posts_db_repository_1.postsRepository.findPosts();
    res.status(200).send(allPosts);
}));
exports.postsRouter.post("/", basic_auth_middleware_1.basicAuthMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, shortDescription, content, blogId } = req.body;
    const blog = yield blogs_db_repository_1.blogsRepository.findBlog(blogId);
    if (!blog) {
        return res.sendStatus(404);
    }
    const createPost = yield posts_db_repository_1.postsRepository.createPost(title, shortDescription, content, blogId, blog.name);
    return res.status(201).send(createPost);
}));
exports.postsRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const getPost = yield posts_db_repository_1.postsRepository.findPost(postId);
    if (!getPost) {
        return res.sendStatus(404);
    }
    else {
        return res.status(200).send(getPost);
    }
}));
exports.postsRouter.put("/:id", basic_auth_middleware_1.basicAuthMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const { title, shortDescription, content, blogId } = req.body;
    const getUpdatedPost = yield posts_db_repository_1.postsRepository.updatePost(postId, title, shortDescription, content, blogId);
    if (!getUpdatedPost) {
        return res.sendStatus(404);
    }
    return res.sendStatus(204);
}));
exports.postsRouter.delete("/:id", basic_auth_middleware_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const getDeletedPost = yield posts_db_repository_1.postsRepository.deletePost(postId);
    if (!getDeletedPost) {
        return res.sendStatus(404);
    }
    return res.sendStatus(204);
}));
