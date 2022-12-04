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
exports.blogIdValidation = exports.contentValidation = exports.shortDescriptionValidation = exports.titleValidation = exports.postsRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const basic_auth_middleware_1 = require("../middlewares/basic-auth-middleware");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const blogs_db_query_repository_1 = require("../repositories/blogs-db-query-repository");
const posts_service_1 = require("../domain/posts-service");
const posts_db_query_repository_1 = require("../repositories/posts-db-query-repository");
exports.postsRouter = (0, express_1.Router)({});
// middlewares
exports.titleValidation = (0, express_validator_1.body)("title")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 30 });
exports.shortDescriptionValidation = (0, express_validator_1.body)("shortDescription")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 100 });
exports.contentValidation = (0, express_validator_1.body)("content")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 1000 });
exports.blogIdValidation = (0, express_validator_1.body)("blogId")
    .isString()
    .custom((blogId) => __awaiter(void 0, void 0, void 0, function* () {
    const findBlogWithId = yield blogs_db_query_repository_1.blogsQueryRepository.findBlog(blogId);
    if (!findBlogWithId) {
        throw new Error("blog with this id does not exist in the DB");
    }
    else {
        return true;
    }
}));
const pageNumberValidation = (0, express_validator_1.query)("pageNumber").toInt().default(1);
const pageSize = (0, express_validator_1.query)("pageSize").toInt().default(10);
const sortBy = (0, express_validator_1.query)("sortBy").default("createdAt");
// routes
exports.postsRouter.get("/", pageSize, sortBy, pageNumberValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sortBy, sortDirection } = req.query;
    const { pageSize, pageNumber } = req.query;
    const allPosts = yield posts_db_query_repository_1.postsQueryRepository.findPosts(pageNumber, pageSize, sortBy, sortDirection);
    res.status(200).send(allPosts);
}));
exports.postsRouter.post("/", basic_auth_middleware_1.basicAuthMiddleware, exports.titleValidation, exports.shortDescriptionValidation, exports.contentValidation, exports.blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, shortDescription, content, blogId } = req.body;
    const blog = yield blogs_db_query_repository_1.blogsQueryRepository.findBlog(blogId);
    if (!blog) {
        return res.sendStatus(404);
    }
    const createPost = yield posts_service_1.postsService.createPost(title, shortDescription, content, blogId, blog.name);
    return res.status(201).send(createPost);
}));
exports.postsRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const getPost = yield posts_db_query_repository_1.postsQueryRepository.findPost(postId);
    if (!getPost) {
        return res.sendStatus(404);
    }
    else {
        return res.status(200).send(getPost);
    }
}));
exports.postsRouter.put("/:id", basic_auth_middleware_1.basicAuthMiddleware, exports.titleValidation, exports.shortDescriptionValidation, exports.contentValidation, exports.blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const { title, shortDescription, content, blogId } = req.body;
    const getUpdatedPost = yield posts_service_1.postsService.updatePost(postId, title, shortDescription, content, blogId);
    if (!getUpdatedPost) {
        return res.sendStatus(404);
    }
    return res.sendStatus(204);
}));
exports.postsRouter.delete("/:id", basic_auth_middleware_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const getDeletedPost = yield posts_service_1.postsService.deletePost(postId);
    if (!getDeletedPost) {
        return res.sendStatus(404);
    }
    return res.sendStatus(204);
}));
