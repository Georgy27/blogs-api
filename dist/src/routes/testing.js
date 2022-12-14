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
exports.testingRouter = void 0;
const express_1 = require("express");
const blogs_db_repository_1 = require("../repositories/blogs-db-repository");
const posts_db_repository_1 = require("../repositories/posts-db-repository");
const users_db_repository_1 = require("../repositories/users-db-repository");
const comments_db_repository_1 = require("../repositories/comments-db-repository");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter.delete("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield blogs_db_repository_1.blogsRepository.clearBlogs();
    yield posts_db_repository_1.postsRepository.clearPosts();
    yield users_db_repository_1.usersRepository.clearUsers();
    yield comments_db_repository_1.commentsRepository.clearComments();
    return res.sendStatus(204);
}));
