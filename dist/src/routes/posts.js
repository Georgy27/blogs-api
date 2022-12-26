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
const basic_auth_middleware_1 = require("../middlewares/basic-auth-middleware");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const blogs_db_query_repository_1 = require("../repositories/blogs-db-query-repository");
const posts_service_1 = require("../domain/posts-service");
const posts_db_query_repository_1 = require("../repositories/posts-db-query-repository");
const sorting_pagination_middleware_1 = require("../middlewares/sorting&pagination-middleware");
const titleValidation_1 = require("../middlewares/posts-middleware/titleValidation");
const shortDescriptionValidation_1 = require("../middlewares/posts-middleware/shortDescriptionValidation");
const contentValidation_1 = require("../middlewares/posts-middleware/contentValidation");
const blogIdValidation_1 = require("../middlewares/posts-middleware/blogIdValidation");
const comments_service_1 = require("../domain/comments-service");
const jwt_auth_middleware_1 = require("../middlewares/jwt-auth-middleware");
const comments_db_query_repository_1 = require("../repositories/comments-db-query-repository");
const content_validation_1 = require("../middlewares/comments-middleware/content-validation");
const morgan_middleware_1 = require("../middlewares/morgan-middleware");
exports.postsRouter = (0, express_1.Router)({});
// routes
exports.postsRouter.get("/", sorting_pagination_middleware_1.pageSize, sorting_pagination_middleware_1.sortBy, sorting_pagination_middleware_1.pageNumberValidation, (0, morgan_middleware_1.morgan)("tiny"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sortBy, sortDirection } = req.query;
    const { pageSize, pageNumber } = req.query;
    const allPosts = yield posts_db_query_repository_1.postsQueryRepository.findPosts(pageNumber, pageSize, sortBy, sortDirection);
    res.status(200).send(allPosts);
}));
// returns all comments for specified post
exports.postsRouter.get("/:postId/comments", sorting_pagination_middleware_1.pageSize, sorting_pagination_middleware_1.sortBy, sorting_pagination_middleware_1.pageNumberValidation, (0, morgan_middleware_1.morgan)("tiny"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sortBy, sortDirection, pageSize, pageNumber } = req.query;
    const postId = req.params.postId;
    const isPost = yield posts_db_query_repository_1.postsQueryRepository.findPost(postId);
    if (!isPost) {
        return res.sendStatus(404);
    }
    const allCommentsWithId = yield comments_db_query_repository_1.commentsQueryRepository.findComments(pageNumber, pageSize, sortBy, sortDirection, postId);
    res.status(200).send(allCommentsWithId);
}));
exports.postsRouter.post("/", basic_auth_middleware_1.basicAuthMiddleware, titleValidation_1.titleValidation, shortDescriptionValidation_1.shortDescriptionValidation, contentValidation_1.contentValidation, blogIdValidation_1.blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, (0, morgan_middleware_1.morgan)("tiny"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, shortDescription, content, blogId } = req.body;
    const blog = yield blogs_db_query_repository_1.blogsQueryRepository.findBlog(blogId);
    if (!blog) {
        return res.sendStatus(404);
    }
    const createPost = yield posts_service_1.postsService.createPost(title, shortDescription, content, blogId, blog.name);
    return res.status(201).send(createPost);
}));
// Create new comment
exports.postsRouter.post("/:postId/comments", jwt_auth_middleware_1.jwtAuthMiddleware, content_validation_1.commentsValidation, input_validation_middleware_1.inputValidationMiddleware, (0, morgan_middleware_1.morgan)("tiny"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    const comment = req.body.content;
    const isPost = yield posts_db_query_repository_1.postsQueryRepository.findPost(postId);
    if (!isPost) {
        return res.sendStatus(404);
    }
    const createComment = yield comments_service_1.commentsService.createComment(postId, comment, req.user.userId, req.user.login);
    return res.status(201).send(createComment);
}));
exports.postsRouter.get("/:id", (0, morgan_middleware_1.morgan)("tiny"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const getPost = yield posts_db_query_repository_1.postsQueryRepository.findPost(postId);
    if (!getPost) {
        return res.sendStatus(404);
    }
    else {
        return res.status(200).send(getPost);
    }
}));
exports.postsRouter.put("/:id", basic_auth_middleware_1.basicAuthMiddleware, titleValidation_1.titleValidation, shortDescriptionValidation_1.shortDescriptionValidation, contentValidation_1.contentValidation, blogIdValidation_1.blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, (0, morgan_middleware_1.morgan)("tiny"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const { title, shortDescription, content, blogId } = req.body;
    const getUpdatedPost = yield posts_service_1.postsService.updatePost(postId, title, shortDescription, content, blogId);
    if (!getUpdatedPost) {
        return res.sendStatus(404);
    }
    return res.sendStatus(204);
}));
exports.postsRouter.delete("/:id", basic_auth_middleware_1.basicAuthMiddleware, (0, morgan_middleware_1.morgan)("tiny"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const getDeletedPost = yield posts_service_1.postsService.deletePost(postId);
    if (!getDeletedPost) {
        return res.sendStatus(404);
    }
    return res.sendStatus(204);
}));
