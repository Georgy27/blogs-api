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
    findPost(id) {
        const getPost = posts.find((post) => {
            return post.id === id;
        });
        return getPost;
    },
    updatePost(post, title, shortDescription, content, blogId) {
        post.title = title;
        post.shortDescription = shortDescription;
        post.content = content;
        post.blogId = blogId;
        return post;
    },
    deletePost(id) {
        const getDeletedPost = posts.filter((post) => {
            return post.id !== id;
        });
        posts = getDeletedPost;
        return posts;
    },
    clearPosts() {
        posts = [];
    },
};
