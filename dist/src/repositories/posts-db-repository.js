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
exports.PostsRepository = void 0;
const post_schema_1 = require("../models/posts-model/post-schema");
class PostsRepository {
    createPost(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            yield post_schema_1.PostsModel.create(Object.assign({}, newPost));
            return newPost;
        });
    }
    updatePost(postId, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield post_schema_1.PostsModel.updateOne({ id: postId }, { title, shortDescription, content, blogId });
            return result.matchedCount === 1;
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield post_schema_1.PostsModel.deleteOne({ id });
            return result.deletedCount === 1;
        });
    }
    clearPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            yield post_schema_1.PostsModel.deleteMany({});
        });
    }
}
exports.PostsRepository = PostsRepository;
