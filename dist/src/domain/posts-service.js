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
exports.PostsService = void 0;
const crypto_1 = require("crypto");
const posts_db_repository_1 = require("../repositories/posts-db-repository");
const blogs_db_query_repository_1 = require("../repositories/blogs-db-query-repository");
const inversify_1 = require("inversify");
let PostsService = class PostsService {
    constructor(postsRepository, blogsQueryRepository) {
        this.postsRepository = postsRepository;
        this.blogsQueryRepository = blogsQueryRepository;
    }
    createPost(blogId, title, shortDescription, content) {
        return __awaiter(this, void 0, void 0, function* () {
            // get blog
            const blog = yield this.blogsQueryRepository.findBlog(blogId);
            if (!blog)
                return null;
            // create a post for specified blog
            const newPost = {
                id: (0, crypto_1.randomUUID)(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: blog.name,
                createdAt: new Date().toISOString(),
            };
            return this.postsRepository.createPost(newPost);
        });
    }
    updatePost(postId, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postsRepository.updatePost(postId, title, shortDescription, content, blogId);
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postsRepository.deletePost(id);
        });
    }
};
PostsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(posts_db_repository_1.PostsRepository)),
    __param(1, (0, inversify_1.inject)(blogs_db_query_repository_1.BlogsQueryRepository)),
    __metadata("design:paramtypes", [posts_db_repository_1.PostsRepository,
        blogs_db_query_repository_1.BlogsQueryRepository])
], PostsService);
exports.PostsService = PostsService;
