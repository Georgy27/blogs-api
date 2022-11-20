"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const blogs_repositories_1 = require("../repositories/blogs-repositories");
const basic_auth_middleware_1 = require("../middlewares/basic-auth-middleware");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
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
// routes
exports.blogsRouter.get("/", (req, res) => {
    const allBlogs = blogs_repositories_1.blogsRepository.findBlogs();
    res.status(200).send(allBlogs);
});
exports.blogsRouter.post("/", basic_auth_middleware_1.basicAuthMiddleware, nameValidation, descriptionValidation, websiteValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    const { name, description, websiteUrl } = req.body;
    const createBlog = blogs_repositories_1.blogsRepository.createBlog(name, description, websiteUrl);
    return res.status(201).send(createBlog);
});
exports.blogsRouter.get("/:id", (req, res) => {
    const blogId = req.params.id;
    const getBlog = blogs_repositories_1.blogsRepository.findBlog(blogId);
    if (!getBlog) {
        return res.sendStatus(404);
    }
    else {
        return res.status(200).send(getBlog);
    }
});
exports.blogsRouter.put("/:id", basic_auth_middleware_1.basicAuthMiddleware, nameValidation, descriptionValidation, websiteValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    const blogId = req.params.id;
    const { name, description, websiteUrl } = req.body;
    const getBlog = blogs_repositories_1.blogsRepository.findBlog(blogId);
    if (!getBlog) {
        return res.sendStatus(404);
    }
    else {
        const getUpdatedBlog = blogs_repositories_1.blogsRepository.updateBlog(getBlog, name, description, websiteUrl);
        return res.sendStatus(204);
    }
});
exports.blogsRouter.delete("/:id", basic_auth_middleware_1.basicAuthMiddleware, (req, res) => {
    const blogId = req.params.id;
    const getBlog = blogs_repositories_1.blogsRepository.findBlog(blogId);
    if (!getBlog) {
        return res.sendStatus(404);
    }
    else {
        const getDeletedBlog = blogs_repositories_1.blogsRepository.deleteBlog(blogId);
        return res.sendStatus(204);
    }
});
