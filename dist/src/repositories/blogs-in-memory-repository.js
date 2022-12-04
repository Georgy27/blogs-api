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
exports.blogsRepository = exports.blogs = void 0;
const crypto_1 = require("crypto");
exports.blogs = [];
exports.blogsRepository = {
    findBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return exports.blogs;
        });
    },
    createBlog(name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                id: (0, crypto_1.randomUUID)(),
                name: name,
                description: description,
                websiteUrl: websiteUrl,
            };
            exports.blogs.push(newBlog);
            return newBlog;
        });
    },
    findBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const getBlog = exports.blogs.find((blog) => {
                return blog.id === id;
            });
            return getBlog;
        });
    },
    updateBlog(blog, name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            blog.name = name;
            blog.description = description;
            blog.websiteUrl = websiteUrl;
            return blog;
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const getDeletedBlog = exports.blogs.filter((blog) => {
                return blog.id !== id;
            });
            exports.blogs = getDeletedBlog;
            return exports.blogs;
        });
    },
    clearBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            exports.blogs = [];
        });
    },
};
