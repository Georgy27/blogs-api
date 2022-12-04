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
const express_validator_1 = require("express-validator");
const basic_auth_middleware_1 = require("../middlewares/basic-auth-middleware");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const blogs_service_1 = require("../domain/blogs-service");
const blogs_db_query_repository_1 = require("../repositories/blogs-db-query-repository");
const posts_1 = require("./posts");
const posts_service_1 = require("../domain/posts-service");
const posts_db_query_repository_1 = require("../repositories/posts-db-query-repository");
exports.blogsRouter = (0, express_1.Router)({});
// middlewares
const nameValidation = (0, express_validator_1.body)("name")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 15 })
    .withMessage("name can not be longer than 15 characters");
const descriptionValidation = (0, express_validator_1.body)("description")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 500 });
const websiteValidation = (0, express_validator_1.body)("websiteUrl")
    .isLength({ max: 100 })
    .matches("^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$");
const pageNumberValidation = (0, express_validator_1.query)("pageNumber").toInt().default(1);
const pageSize = (0, express_validator_1.query)("pageSize").toInt().default(10);
const sortBy = (0, express_validator_1.query)("sortBy").default("createdAt");
// const sortDirection = query("sortDirection");
// const searchNameTerm = query("searchNameTerm").default(null);
// routes
exports.blogsRouter.get("/", pageSize, sortBy, pageNumberValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchNameTerm, sortBy, sortDirection } = req.query;
    const { pageSize, pageNumber } = req.query;
    console.log(searchNameTerm);
    const allBlogs = yield blogs_db_query_repository_1.blogsQueryRepository.findBlogs(searchNameTerm, pageSize, sortBy, pageNumber, sortDirection);
    res.status(200).send(allBlogs);
}));
// returns all posts for specified blog
exports.blogsRouter.get("/:blogId/posts", pageSize, sortBy, pageNumberValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.blogsRouter.post("/", basic_auth_middleware_1.basicAuthMiddleware, nameValidation, descriptionValidation, websiteValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, websiteUrl } = req.body;
    const createBlog = yield blogs_service_1.blogsService.createBlog(name, description, websiteUrl);
    return res.status(201).send(createBlog);
}));
// creates new post for specific route
exports.blogsRouter.post("/:blogId/posts", basic_auth_middleware_1.basicAuthMiddleware, posts_1.titleValidation, posts_1.shortDescriptionValidation, posts_1.contentValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, shortDescription, content } = req.body;
    const blogId = req.params.blogId;
    const blog = yield blogs_db_query_repository_1.blogsQueryRepository.findBlog(blogId);
    if (!blog) {
        return res.sendStatus(404);
    }
    const createPost = yield posts_service_1.postsService.createPost(title, shortDescription, content, blogId, blog.name);
    return res.status(201).send(createPost);
}));
exports.blogsRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const getBlog = yield blogs_db_query_repository_1.blogsQueryRepository.findBlog(blogId);
    if (!getBlog) {
        return res.sendStatus(404);
    }
    else {
        return res.status(200).send(getBlog);
    }
}));
exports.blogsRouter.put("/:id", basic_auth_middleware_1.basicAuthMiddleware, nameValidation, descriptionValidation, websiteValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const { name, description, websiteUrl } = req.body;
    const getUpdatedBlog = yield blogs_service_1.blogsService.updateBlog(blogId, name, description, websiteUrl);
    if (!getUpdatedBlog) {
        return res.sendStatus(404);
    }
    return res.sendStatus(204);
}));
exports.blogsRouter.delete("/:id", basic_auth_middleware_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const getDeletedBlog = yield blogs_service_1.blogsService.deleteBlog(blogId);
    if (!getDeletedBlog) {
        return res.sendStatus(404);
    }
    return res.sendStatus(204);
}));
