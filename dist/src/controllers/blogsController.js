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
exports.BlogsController = void 0;
const blogs_service_1 = require("../domain/blogs-service");
const blogs_db_query_repository_1 = require("../repositories/blogs-db-query-repository");
const posts_db_query_repository_1 = require("../repositories/posts-db-query-repository");
const posts_service_1 = require("../domain/posts-service");
const inversify_1 = require("inversify");
let BlogsController = class BlogsController {
    constructor(blogsService, blogsQueryRepository, postsQueryRepository, postsService) {
        this.blogsService = blogsService;
        this.blogsQueryRepository = blogsQueryRepository;
        this.postsQueryRepository = postsQueryRepository;
        this.postsService = postsService;
    }
    createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, websiteUrl } = req.body;
            const createBlog = yield this.blogsService.createBlog(name, description, websiteUrl);
            return res.status(201).send(createBlog);
        });
    }
    updateBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogId = req.params.id;
            const { name, description, websiteUrl } = req.body;
            const getUpdatedBlog = yield this.blogsService.updateBlog(blogId, name, description, websiteUrl);
            if (!getUpdatedBlog) {
                return res.sendStatus(404);
            }
            return res.sendStatus(204);
        });
    }
    getAllBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { searchNameTerm, sortBy, sortDirection } = req.query;
            const { pageSize, pageNumber } = req.query;
            const allBlogs = yield this.blogsQueryRepository.findBlogs(searchNameTerm, pageSize, sortBy, pageNumber, sortDirection);
            res.status(200).send(allBlogs);
        });
    }
    getBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogId = req.params.id;
            const getBlog = yield this.blogsQueryRepository.findBlog(blogId);
            if (!getBlog) {
                return res.sendStatus(404);
            }
            else {
                return res.status(200).send(getBlog);
            }
        });
    }
    deleteBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogId = req.params.id;
            const getDeletedBlog = yield this.blogsService.deleteBlog(blogId);
            if (!getDeletedBlog) {
                return res.sendStatus(404);
            }
            return res.sendStatus(204);
        });
    }
    getAllPostsForSpecifiedBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sortBy, sortDirection } = req.query;
            const { pageSize, pageNumber } = req.query;
            const blogId = req.params.blogId;
            const getBlogById = yield this.blogsQueryRepository.findBlog(blogId);
            if (!getBlogById) {
                return res.sendStatus(404);
            }
            const allPostsWithId = yield this.postsQueryRepository.findPosts(pageNumber, pageSize, sortBy, sortDirection, blogId);
            res.status(200).send(allPostsWithId);
        });
    }
    createPostForSpecifiedBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, shortDescription, content } = req.body;
            const blogId = req.params.blogId;
            const newPostForBlogId = yield this.postsService.createPost(blogId, title, shortDescription, content);
            if (!newPostForBlogId) {
                return res.sendStatus(404);
            }
            return res.status(201).send(newPostForBlogId);
        });
    }
};
BlogsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(blogs_service_1.BlogsService)),
    __param(1, (0, inversify_1.inject)(blogs_db_query_repository_1.BlogsQueryRepository)),
    __param(2, (0, inversify_1.inject)(posts_db_query_repository_1.PostsQueryRepository)),
    __param(3, (0, inversify_1.inject)(posts_service_1.PostsService)),
    __metadata("design:paramtypes", [blogs_service_1.BlogsService,
        blogs_db_query_repository_1.BlogsQueryRepository,
        posts_db_query_repository_1.PostsQueryRepository,
        posts_service_1.PostsService])
], BlogsController);
exports.BlogsController = BlogsController;
