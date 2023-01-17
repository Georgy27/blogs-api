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
exports.commentsRepository = void 0;
const comment_schema_1 = require("../models/comments-model/comment-schema");
exports.commentsRepository = {
    createComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield comment_schema_1.CommentsModel.create(Object.assign({}, comment));
            return {
                id: comment.id,
                content: comment.content,
                userId: comment.userId,
                userLogin: comment.userLogin,
                createdAt: comment.createdAt,
            };
        });
    },
    updateComment(content, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield comment_schema_1.CommentsModel.updateOne({ id: id }, { content });
            return result.matchedCount === 1;
        });
    },
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield comment_schema_1.CommentsModel.deleteOne({ id });
            return result.deletedCount === 1;
        });
    },
    clearComments() {
        return __awaiter(this, void 0, void 0, function* () {
            yield comment_schema_1.CommentsModel.deleteMany({});
        });
    },
};
