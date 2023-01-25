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
exports.CommentsController = void 0;
class CommentsController {
    constructor(commentsService, commentsQueryRepository, reactionsService) {
        this.commentsService = commentsService;
        this.commentsQueryRepository = commentsQueryRepository;
        this.reactionsService = reactionsService;
    }
    updateCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentId = req.params.commentId;
            const comment = req.body.content;
            const userId = req.user.userId;
            const getUpdatedComment = yield this.commentsService.updateComment(comment, commentId, userId);
            if (getUpdatedComment === "404")
                return res.sendStatus(404);
            if (getUpdatedComment === "403")
                return res.sendStatus(403);
            return res.sendStatus(204);
        });
    }
    getCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentId = req.params.id;
            const userId = req.user.userId;
            const getCommentById = yield this.commentsQueryRepository.findCommentWithLikesInfo(commentId, userId);
            if (!getCommentById) {
                return res.sendStatus(404);
            }
            return res.status(200).send(getCommentById);
        });
    }
    updateReaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const commentId = req.params.commentId;
            const { likeStatus } = req.body;
            // find comment
            const comment = yield this.commentsQueryRepository.findCommentWithLikesInfo(commentId, user.userId);
            if (!comment)
                return res.sendStatus(404);
            // update reaction
            yield this.reactionsService.updateReaction("comment", commentId, user.userId, user.login, likeStatus);
            return res.sendStatus(204);
        });
    }
    deleteCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentId = req.params.commentId;
            const userId = req.user.userId;
            const getDeletedComment = yield this.commentsService.deleteComment(commentId, userId);
            if (getDeletedComment === "404")
                return res.sendStatus(404);
            if (getDeletedComment === "403")
                return res.sendStatus(403);
            return res.sendStatus(204);
        });
    }
}
exports.CommentsController = CommentsController;
