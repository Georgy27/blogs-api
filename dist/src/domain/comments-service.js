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
exports.commentsService = void 0;
const comments_db_repository_1 = require("../repositories/comments-db-repository");
const crypto_1 = require("crypto");
exports.commentsService = {
    createComment(comment, userId, userLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = {
                id: (0, crypto_1.randomUUID)(),
                content: comment,
                userId: userId,
                userLogin: userLogin,
                createdAt: new Date().toISOString(),
            };
            return comments_db_repository_1.commentsRepository.createComment(newComment);
        });
    },
};
