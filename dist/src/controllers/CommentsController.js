"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const comments_service_1 = require("../domain/comments-service");
const comments_db_query_repository_1 = require("../repositories/comments-db-query-repository");
const reactions_service_1 = require("../domain/reactions-service");
const inversify_1 = require("inversify");
let CommentsController = class CommentsController {
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
            const userId = req.user ? req.user.userId : null;
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
            const comment = yield this.commentsQueryRepository.findComment(commentId);
            if (!comment)
                return res.sendStatus(404);
            // update reaction
            const result = yield this.reactionsService.updateReaction("comment", commentId, user.userId, user.login, likeStatus);
            // if (!result) return res.sendStatus(404);
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
};
CommentsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(comments_service_1.CommentsService)),
    __param(1, (0, inversify_1.inject)(comments_db_query_repository_1.CommentsQueryRepository)),
    __param(2, (0, inversify_1.inject)(reactions_service_1.ReactionsService)),
    __metadata("design:paramtypes", [comments_service_1.CommentsService,
        comments_db_query_repository_1.CommentsQueryRepository,
        reactions_service_1.ReactionsService])
], CommentsController);
exports.CommentsController = CommentsController;
