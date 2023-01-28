"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.CommentsQueryRepository = void 0;
const comment_schema_1 = require("../models/comments-model/comment-schema");
const reactions_schema_1 = require("../models/reactions-model/reactions-schema");
const reactions_model_1 = require("../models/reactions-model");
const inversify_1 = require("inversify");
let CommentsQueryRepository = class CommentsQueryRepository {
    findComments(pageNumber, pageSize, sortBy, sortDirection, postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield comment_schema_1.CommentsModel.find({ postId }, { _id: false, postId: false })
                .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean();
            const commentsWithLikesInfo = yield Promise.all(comments.map((comment) => __awaiter(this, void 0, void 0, function* () {
                return this.addLikesInfoToComment(comment, userId);
            })));
            const numberOfComments = yield comment_schema_1.CommentsModel.countDocuments({
                postId,
            });
            return {
                pagesCount: Math.ceil(numberOfComments / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: numberOfComments,
                items: commentsWithLikesInfo,
            };
        });
    }
    findComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comment_schema_1.CommentsModel.findOne({ id }, { _id: false, postId: false }).lean();
            return comment;
        });
    }
    findCommentWithLikesInfo(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comment_schema_1.CommentsModel.findOne({ id }, { _id: false, postId: false }).lean();
            if (!comment)
                return null;
            return this.addLikesInfoToComment(comment, userId);
        });
    }
    addLikesInfoToComment(comment, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const likes = yield reactions_schema_1.ReactionsModel.countDocuments({
                parentId: comment.id,
                status: "Like",
            });
            console.log(likes);
            const dislikes = yield reactions_schema_1.ReactionsModel.countDocuments({
                parentId: comment.id,
                status: reactions_model_1.reactionStatusEnum.Dislike,
            });
            let myStatus = "None";
            if (userId) {
                // console.log("I am user");
                const myStatusFromDb = yield reactions_schema_1.ReactionsModel.findOne({ parentId: comment.id, userId: userId }, { _id: 0 }).lean();
                if (myStatusFromDb) {
                    myStatus = myStatusFromDb.status;
                }
            }
            comment.likesInfo.likesCount = likes;
            comment.likesInfo.dislikesCount = dislikes;
            comment.likesInfo.myStatus = myStatus;
            return comment;
        });
    }
};
CommentsQueryRepository = __decorate([
    (0, inversify_1.injectable)()
], CommentsQueryRepository);
exports.CommentsQueryRepository = CommentsQueryRepository;
