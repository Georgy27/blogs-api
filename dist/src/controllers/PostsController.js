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
exports.PostsController = void 0;
class PostsController {
    constructor(postsService, postsQueryRepository, commentsService, commentsQueryRepository) {
        this.postsService = postsService;
        this.postsQueryRepository = postsQueryRepository;
        this.commentsService = commentsService;
        this.commentsQueryRepository = commentsQueryRepository;
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
            const allPosts = yield this.postsQueryRepository.findPosts(pageNumber, pageSize, sortBy, sortDirection);
            res.status(200).send(allPosts);
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.id;
            const getPost = yield this.postsQueryRepository.findPost(postId);
            if (!getPost) {
                return res.sendStatus(404);
            }
            else {
                return res.status(200).send(getPost);
            }
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
    getAllCommentsForSpecifiedPost(req, 
    // req: RequestWithParamsAndQuery<{ postId: string }, QueryPostModel>,
    res) {
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
}
exports.PostsController = PostsController;
