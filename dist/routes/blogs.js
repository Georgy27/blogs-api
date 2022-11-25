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
const blogs_db_repository_1 = require("../repositories/blogs-db-repository");
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
exports.blogsRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allBlogs = yield blogs_db_repository_1.blogsRepository.findBlogs();
    res.status(200).send(allBlogs);
}));
exports.blogsRouter.post("/", basic_auth_middleware_1.basicAuthMiddleware, nameValidation, descriptionValidation, websiteValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, websiteUrl } = req.body;
    const createBlog = yield blogs_db_repository_1.blogsRepository.createBlog(name, description, websiteUrl);
    return res.status(201).send(createBlog);
}));
exports.blogsRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const getBlog = yield blogs_db_repository_1.blogsRepository.findBlog(blogId);
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
    const getUpdatedBlog = yield blogs_db_repository_1.blogsRepository.updateBlog(blogId, name, description, websiteUrl);
    if (!getUpdatedBlog) {
        return res.sendStatus(404);
    }
    return res.sendStatus(204);
}));
exports.blogsRouter.delete("/:id", basic_auth_middleware_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const getDeletedBlog = yield blogs_db_repository_1.blogsRepository.deleteBlog(blogId);
    if (!getDeletedBlog) {
        return res.sendStatus(404);
    }
    return res.sendStatus(204);
}));
