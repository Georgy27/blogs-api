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
exports.postsService = void 0;
const crypto_1 = require("crypto");
const posts_db_repository_1 = require("../repositories/posts-db-repository");
exports.postsService = {
    createPost(title, shortDescription, content, blogId, blogName) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPost = {
                id: (0, crypto_1.randomUUID)(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: blogName,
                createdAt: new Date().toISOString(),
            };
            return posts_db_repository_1.postsRepository.createPost(newPost);
        });
    },
    updatePost(postId, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return posts_db_repository_1.postsRepository.updatePost(postId, title, shortDescription, content, blogId);
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return posts_db_repository_1.postsRepository.deletePost(id);
        });
    },
};
