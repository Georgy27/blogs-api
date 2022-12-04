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
exports.postsQueryRepository = void 0;
const db_1 = require("./db");
exports.postsQueryRepository = {
    findPosts(pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield db_1.postsCollection
                .find({}, { projection: { _id: false } })
                .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray();
            const numberOfPosts = yield db_1.postsCollection.count({}, { skip: (pageNumber - 1) * pageSize, limit: pageSize });
            return {
                pagesCount: Math.ceil(numberOfPosts / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: numberOfPosts,
                items: posts,
            };
        });
    },
    findPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.postsCollection.findOne({ id }, { projection: { _id: false } });
            return post;
        });
    },
};
