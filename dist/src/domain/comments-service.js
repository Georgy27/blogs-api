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
exports.CommentsService = void 0;
const comments_db_repository_1 = require("../repositories/comments-db-repository");
const crypto_1 = require("crypto");
const posts_db_query_repository_1 = require("../repositories/posts-db-query-repository");
const comments_db_query_repository_1 = require("../repositories/comments-db-query-repository");
const inversify_1 = require("inversify");
let CommentsService = class CommentsService {
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
                commentatorInfo: {
                    userId: userId,
                    userLogin: userLogin,
                },
                createdAt: new Date().toISOString(),
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: "None",
                },
            };
            // create comment
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
            if (getCommentById.commentatorInfo.userId !== userId) {
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
            if (getCommentById.commentatorInfo.userId !== userId) {
                return "403";
            }
            // delete the comment
            return this.commentsRepository.deleteComment(id);
        });
    }
};
CommentsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(comments_db_repository_1.CommentsRepository)),
    __param(1, (0, inversify_1.inject)(posts_db_query_repository_1.PostsQueryRepository)),
    __param(2, (0, inversify_1.inject)(comments_db_query_repository_1.CommentsQueryRepository)),
    __metadata("design:paramtypes", [comments_db_repository_1.CommentsRepository,
        posts_db_query_repository_1.PostsQueryRepository,
        comments_db_query_repository_1.CommentsQueryRepository])
], CommentsService);
exports.CommentsService = CommentsService;
