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
exports.commentsQueryRepository = void 0;
const comment_schema_1 = require("../models/comments-model/comment-schema");
exports.commentsQueryRepository = {
    findComments(pageNumber, pageSize, sortBy, sortDirection, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield comment_schema_1.CommentsModel.find({ postId }, { _id: false, postId: false })
                .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean();
            const numberOfComments = yield comment_schema_1.CommentsModel.countDocuments({
                postId,
            });
            return {
                pagesCount: Math.ceil(numberOfComments / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: numberOfComments,
                items: comments,
            };
        });
    },
    findComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return comment_schema_1.CommentsModel.findOne({ id }, { _id: false, postId: false });
        });
    },
};
