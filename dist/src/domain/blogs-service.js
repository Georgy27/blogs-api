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
exports.BlogsService = void 0;
const crypto_1 = require("crypto");
class BlogsService {
    constructor(blogsRepository) {
        this.blogsRepository = blogsRepository;
    }
    createBlog(name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                id: (0, crypto_1.randomUUID)(),
                name: name,
                description: description,
                websiteUrl: websiteUrl,
                createdAt: new Date().toISOString(),
            };
            return this.blogsRepository.createBlog(newBlog);
        });
    }
    updateBlog(blogId, name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.blogsRepository.updateBlog(blogId, name, description, websiteUrl);
        });
    }
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.blogsRepository.deleteBlog(id);
        });
    }
}
exports.BlogsService = BlogsService;
