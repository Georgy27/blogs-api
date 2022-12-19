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
exports.commentsRouter = void 0;
const express_1 = require("express");
const comments_db_query_repository_1 = require("../repositories/comments-db-query-repository");
const jwt_auth_middleware_1 = require("../middlewares/jwt-auth-middleware");
const comments_service_1 = require("../domain/comments-service");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const content_validation_1 = require("../middlewares/comments-middleware/content-validation");
exports.commentsRouter = (0, express_1.Router)({});
// routes
exports.commentsRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.id;
    const getCommentById = yield comments_db_query_repository_1.commentsQueryRepository.findComment(commentId);
    if (!getCommentById) {
        return res.sendStatus(404);
    }
    return res.status(200).send(getCommentById);
}));
exports.commentsRouter.put("/:commentId", jwt_auth_middleware_1.jwtAuthMiddleware, content_validation_1.commentsValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.commentId;
    const comment = req.body.content;
    const getCommentById = yield comments_db_query_repository_1.commentsQueryRepository.findComment(commentId);
    if (!getCommentById) {
        return res.sendStatus(404);
    }
    if (getCommentById.userId !== req.user.userId) {
        return res.sendStatus(403);
    }
    const getUpdatedComment = yield comments_service_1.commentsService.updateComment(comment, commentId);
    return res.sendStatus(204);
}));
exports.commentsRouter.delete("/:commentId", jwt_auth_middleware_1.jwtAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.commentId;
    const getCommentById = yield comments_db_query_repository_1.commentsQueryRepository.findComment(commentId);
    if (!getCommentById) {
        return res.sendStatus(404);
    }
    if (getCommentById.userId !== req.user.userId) {
        return res.sendStatus(403);
    }
    const getDeletedComment = yield comments_service_1.commentsService.deleteComment(commentId);
    return res.sendStatus(204);
}));
