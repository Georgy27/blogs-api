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
exports.CommentsService = void 0;
const crypto_1 = require("crypto");
class CommentsService {
    constructor(commentsRepository, postsQueryRepository, commentsQueryRepository) {
        this.commentsRepository = commentsRepository;
        this.postsQueryRepository = postsQueryRepository;
        this.commentsQueryRepository = commentsQueryRepository;
    }
    createComment(postId, comment, userId, userLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if the post exists
            const isPost = yield this.postsQueryRepository.findPost(postId);
            if (!isPost)
                return null;
            // if it exists, create new comment
            const newComment = {
                id: (0, crypto_1.randomUUID)(),
                postId,
                content: comment,
                userId: userId,
                userLogin: userLogin,
                createdAt: new Date().toISOString(),
            };
            return this.commentsRepository.createComment(newComment);
        });
    }
    updateComment(content, id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // get comment by Id
            const getCommentById = yield this.commentsQueryRepository.findComment(id);
            if (!getCommentById)
                return "404";
            // check if the comment userId matches the userId of the user that tries to delete the comment
            if (getCommentById.userId !== userId) {
                return "403";
            }
            // update the comment
            return this.commentsRepository.updateComment(content, id);
        });
    }
    deleteComment(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // get comment by Id
            const getCommentById = yield this.commentsQueryRepository.findComment(id);
            if (!getCommentById)
                return "404";
            // check if the comment userId matches the userId of the user that tries to delete the comment
            if (getCommentById.userId !== userId) {
                return "403";
            }
            // delete the comment
            return this.commentsRepository.deleteComment(id);
        });
    }
}
exports.CommentsService = CommentsService;
