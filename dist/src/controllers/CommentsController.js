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
    constructor(commentsService, commentsQueryRepository) {
        this.commentsService = commentsService;
        this.commentsQueryRepository = commentsQueryRepository;
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
            const getCommentById = yield this.commentsQueryRepository.findComment(commentId);
            if (!getCommentById) {
                return res.sendStatus(404);
            }
            return res.status(200).send(getCommentById);
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
