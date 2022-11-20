"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const crypto_1 = require("crypto");
let posts = [];
exports.postsRepository = {
    findPosts() {
        return posts;
    },
    createPost(title, shortDescription, content, blogId, blogName) {
        const newPost = {
            id: (0, crypto_1.randomUUID)(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blogName,
        };
        posts.push(newPost);
        return newPost;
    },
    clearPosts() {
        posts = [];
    },
};
