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
exports.PostsQueryRepository = void 0;
const post_schema_1 = require("../models/posts-model/post-schema");
class PostsQueryRepository {
    findPosts(pageNumber, pageSize, sortBy, sortDirection, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            if (blogId) {
                filter.blogId = { $regex: blogId };
            }
            const posts = yield post_schema_1.PostsModel.find(filter, { _id: false })
                .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean();
            const numberOfPosts = yield post_schema_1.PostsModel.count(filter);
            return {
                pagesCount: Math.ceil(numberOfPosts / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: numberOfPosts,
                items: posts,
            };
        });
    }
    findPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield post_schema_1.PostsModel.findOne({ id }, { _id: false }).lean();
            return post;
        });
    }
}
exports.PostsQueryRepository = PostsQueryRepository;
