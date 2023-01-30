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
exports.PostsController = void 0;
const posts_db_query_repository_1 = require("../repositories/posts-db-query-repository");
const posts_service_1 = require("../domain/posts-service");
const comments_service_1 = require("../domain/comments-service");
const comments_db_query_repository_1 = require("../repositories/comments-db-query-repository");
const inversify_1 = require("inversify");
const reactions_service_1 = require("../domain/reactions-service");
let PostsController = class PostsController {
    constructor(postsService, postsQueryRepository, commentsService, commentsQueryRepository, reactionsService) {
        this.postsService = postsService;
        this.postsQueryRepository = postsQueryRepository;
        this.commentsService = commentsService;
        this.commentsQueryRepository = commentsQueryRepository;
        this.reactionsService = reactionsService;
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, shortDescription, content, blogId } = req.body;
            const newPost = yield this.postsService.createPost(blogId, title, shortDescription, content);
            if (!newPost) {
                return res.sendStatus(404);
            }
            return res.status(201).send(newPost);
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.id;
            const { title, shortDescription, content, blogId } = req.body;
            const getUpdatedPost = yield this.postsService.updatePost(postId, title, shortDescription, content, blogId);
            if (!getUpdatedPost) {
                return res.sendStatus(404);
            }
            return res.sendStatus(204);
        });
    }
    getAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sortBy, sortDirection } = req.query;
            const { pageSize, pageNumber } = req.query;
            const user = req.user ? req.user : null;
            const allPosts = yield this.postsQueryRepository.findPosts(pageNumber, pageSize, sortBy, sortDirection, user);
            res.status(200).send(allPosts);
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.id;
            const user = req.user ? req.user : null;
            const getPost = yield this.postsQueryRepository.findPostWithLikesInfo(postId, user);
            if (!getPost) {
                return res.sendStatus(404);
            }
            else {
                return res.status(200).send(getPost);
            }
        });
    }
    updateReaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const postId = req.params.postId;
            const { likeStatus } = req.body;
            // find post
            const post = yield this.postsQueryRepository.findPost(postId);
            if (!post)
                return res.sendStatus(404);
            // update reaction
            const result = yield this.reactionsService.updateReaction("post", postId, user.userId, user.login, likeStatus);
            return res.sendStatus(204);
        });
    }
    deletePostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.id;
            const getDeletedPost = yield this.postsService.deletePost(postId);
            if (!getDeletedPost) {
                return res.sendStatus(404);
            }
            return res.sendStatus(204);
        });
    }
    createCommentForSpecifiedPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.postId;
            const comment = req.body.content;
            const newComment = yield this.commentsService.createComment(postId, comment, req.user.userId, req.user.login);
            if (!newComment) {
                return res.sendStatus(404);
            }
            return res.status(201).send(newComment);
        });
    }
    getAllCommentsForSpecifiedPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sortBy, sortDirection, pageSize, pageNumber } = req.query;
            const userId = req.user ? req.user.userId : null;
            // find post
            const postId = req.params.postId;
            const isPost = yield this.postsQueryRepository.findPost(postId);
            if (!isPost) {
                return res.sendStatus(404);
            }
            const allCommentsWithId = yield this.commentsQueryRepository.findComments(pageNumber, pageSize, sortBy, sortDirection, postId, userId);
            return res.status(200).send(allCommentsWithId);
        });
    }
};
PostsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(posts_service_1.PostsService)),
    __param(1, (0, inversify_1.inject)(posts_db_query_repository_1.PostsQueryRepository)),
    __param(2, (0, inversify_1.inject)(comments_service_1.CommentsService)),
    __param(3, (0, inversify_1.inject)(comments_db_query_repository_1.CommentsQueryRepository)),
    __param(4, (0, inversify_1.inject)(reactions_service_1.ReactionsService)),
    __metadata("design:paramtypes", [posts_service_1.PostsService,
        posts_db_query_repository_1.PostsQueryRepository,
        comments_service_1.CommentsService,
        comments_db_query_repository_1.CommentsQueryRepository,
        reactions_service_1.ReactionsService])
], PostsController);
exports.PostsController = PostsController;
