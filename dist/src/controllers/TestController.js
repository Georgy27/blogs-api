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
exports.TestController = void 0;
const blogs_db_repository_1 = require("../repositories/blogs-db-repository");
const posts_db_repository_1 = require("../repositories/posts-db-repository");
const users_db_repository_1 = require("../repositories/users-db-repository");
const comments_db_repository_1 = require("../repositories/comments-db-repository");
const reactions_db_repository_1 = require("../repositories/reactions-db-repository");
const inversify_1 = require("inversify");
let TestController = class TestController {
    constructor(blogsRepository, postsRepository, usersRepository, commentsRepository, reactionsRepository) {
        this.blogsRepository = blogsRepository;
        this.postsRepository = postsRepository;
        this.usersRepository = usersRepository;
        this.commentsRepository = commentsRepository;
        this.reactionsRepository = reactionsRepository;
    }
    dropDatabase(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.blogsRepository.clearBlogs();
            yield this.postsRepository.clearPosts();
            yield this.usersRepository.clearUsers();
            yield this.commentsRepository.clearComments();
            yield this.reactionsRepository.clearReactions();
            return res.sendStatus(204);
        });
    }
};
TestController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(blogs_db_repository_1.BlogsRepository)),
    __param(1, (0, inversify_1.inject)(posts_db_repository_1.PostsRepository)),
    __param(2, (0, inversify_1.inject)(users_db_repository_1.UsersRepository)),
    __param(3, (0, inversify_1.inject)(comments_db_repository_1.CommentsRepository)),
    __param(4, (0, inversify_1.inject)(reactions_db_repository_1.ReactionsRepository)),
    __metadata("design:paramtypes", [blogs_db_repository_1.BlogsRepository,
        posts_db_repository_1.PostsRepository,
        users_db_repository_1.UsersRepository,
        comments_db_repository_1.CommentsRepository,
        reactions_db_repository_1.ReactionsRepository])
], TestController);
exports.TestController = TestController;
