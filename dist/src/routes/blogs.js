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
exports.blogsRouter = void 0;
const express_1 = require("express");
const basic_auth_middleware_1 = require("../middlewares/basic-auth-middleware");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const blogs_service_1 = require("../domain/blogs-service");
const blogs_db_query_repository_1 = require("../repositories/blogs-db-query-repository");
const posts_service_1 = require("../domain/posts-service");
const posts_db_query_repository_1 = require("../repositories/posts-db-query-repository");
const nameValidation_1 = require("../middlewares/blogs-middleware/nameValidation");
const descriptionValidation_1 = require("../middlewares/blogs-middleware/descriptionValidation");
const websiteValidation_1 = require("../middlewares/blogs-middleware/websiteValidation");
const sorting_pagination_middleware_1 = require("../middlewares/sorting&pagination-middleware");
const contentValidation_1 = require("../middlewares/posts-middleware/contentValidation");
const titleValidation_1 = require("../middlewares/posts-middleware/titleValidation");
const shortDescriptionValidation_1 = require("../middlewares/posts-middleware/shortDescriptionValidation");
const morgan_middleware_1 = require("../middlewares/morgan-middleware");
exports.blogsRouter = (0, express_1.Router)({});
// routes
exports.blogsRouter.get("/", sorting_pagination_middleware_1.pageSize, sorting_pagination_middleware_1.sortBy, sorting_pagination_middleware_1.pageNumberValidation, (0, morgan_middleware_1.morgan)("tiny"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchNameTerm, sortBy, sortDirection } = req.query;
    const { pageSize, pageNumber } = req.query;
    const allBlogs = yield blogs_db_query_repository_1.blogsQueryRepository.findBlogs(searchNameTerm, pageSize, sortBy, pageNumber, sortDirection);
    res.status(200).send(allBlogs);
}));
// returns all posts for specified blog
exports.blogsRouter.get("/:blogId/posts", sorting_pagination_middleware_1.pageSize, sorting_pagination_middleware_1.sortBy, sorting_pagination_middleware_1.pageNumberValidation, (0, morgan_middleware_1.morgan)("tiny"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sortBy, sortDirection } = req.query;
    const { pageSize, pageNumber } = req.query;
    const blogId = req.params.blogId;
    const getBlogById = yield blogs_db_query_repository_1.blogsQueryRepository.findBlog(blogId);
    if (!getBlogById) {
        return res.sendStatus(404);
    }
    const allPostsWithId = yield posts_db_query_repository_1.postsQueryRepository.findPosts(pageNumber, pageSize, sortBy, sortDirection, blogId);
    res.status(200).send(allPostsWithId);
}));
exports.blogsRouter.post("/", basic_auth_middleware_1.basicAuthMiddleware, nameValidation_1.nameValidation, descriptionValidation_1.descriptionValidation, websiteValidation_1.websiteValidation, input_validation_middleware_1.inputValidationMiddleware, (0, morgan_middleware_1.morgan)("tiny"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, websiteUrl } = req.body;
    const createBlog = yield blogs_service_1.blogsService.createBlog(name, description, websiteUrl);
    return res.status(201).send(createBlog);
}));
// creates new post for specific blog
exports.blogsRouter.post("/:blogId/posts", basic_auth_middleware_1.basicAuthMiddleware, titleValidation_1.titleValidation, shortDescriptionValidation_1.shortDescriptionValidation, contentValidation_1.contentValidation, input_validation_middleware_1.inputValidationMiddleware, (0, morgan_middleware_1.morgan)("tiny"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, shortDescription, content } = req.body;
    const blogId = req.params.blogId;
    const blog = yield blogs_db_query_repository_1.blogsQueryRepository.findBlog(blogId);
    if (!blog) {
        return res.sendStatus(404);
    }
    const createPost = yield posts_service_1.postsService.createPost(title, shortDescription, content, blogId, blog.name);
    return res.status(201).send(createPost);
}));
exports.blogsRouter.get("/:id", (0, morgan_middleware_1.morgan)("tiny"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const getBlog = yield blogs_db_query_repository_1.blogsQueryRepository.findBlog(blogId);
    if (!getBlog) {
        return res.sendStatus(404);
    }
    else {
        return res.status(200).send(getBlog);
    }
}));
exports.blogsRouter.put("/:id", basic_auth_middleware_1.basicAuthMiddleware, nameValidation_1.nameValidation, descriptionValidation_1.descriptionValidation, websiteValidation_1.websiteValidation, input_validation_middleware_1.inputValidationMiddleware, (0, morgan_middleware_1.morgan)("tiny"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const { name, description, websiteUrl } = req.body;
    const getUpdatedBlog = yield blogs_service_1.blogsService.updateBlog(blogId, name, description, websiteUrl);
    if (!getUpdatedBlog) {
        return res.sendStatus(404);
    }
    return res.sendStatus(204);
}));
exports.blogsRouter.delete("/:id", basic_auth_middleware_1.basicAuthMiddleware, (0, morgan_middleware_1.morgan)("tiny"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const getDeletedBlog = yield blogs_service_1.blogsService.deleteBlog(blogId);
    if (!getDeletedBlog) {
        return res.sendStatus(404);
    }
    return res.sendStatus(204);
}));
