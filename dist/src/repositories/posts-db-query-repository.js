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
exports.PostsQueryRepository = void 0;
const post_schema_1 = require("../models/posts-model/post-schema");
const inversify_1 = require("inversify");
const reactions_schema_1 = require("../models/reactions-model/reactions-schema");
const reactions_model_1 = require("../models/reactions-model");
let PostsQueryRepository = class PostsQueryRepository {
    findPosts(pageNumber, pageSize, sortBy, sortDirection, user, blogId) {
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
            console.log(posts);
            const postsWithLikesInfo = yield Promise.all(posts.map((post) => __awaiter(this, void 0, void 0, function* () {
                return this.addLikesInfoToPosts(post, user);
            })));
            const numberOfPosts = yield post_schema_1.PostsModel.count(filter);
            return {
                pagesCount: Math.ceil(numberOfPosts / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: numberOfPosts,
                items: postsWithLikesInfo,
            };
        });
    }
    findPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield post_schema_1.PostsModel.findOne({ id }, { _id: false }).lean();
            return post;
        });
    }
    findPostWithLikesInfo(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield post_schema_1.PostsModel.findOne({ id }, { _id: false }).lean();
            if (!post)
                return null;
            return this.addLikesInfoToPosts(post, user);
        });
    }
    addLikesInfoToPosts(post, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const likes = yield reactions_schema_1.ReactionsModel.countDocuments({
                parentId: post.id,
                status: reactions_model_1.reactionStatusEnum.Like,
            });
            console.log(likes);
            const dislikes = yield reactions_schema_1.ReactionsModel.countDocuments({
                parentId: post.id,
                status: reactions_model_1.reactionStatusEnum.Dislike,
            });
            const newestLikes = yield reactions_schema_1.ReactionsModel.find({
                parentId: post.id,
                status: reactions_model_1.reactionStatusEnum.Like,
            })
                .sort({
                addedAt: "desc",
            })
                .limit(3);
            const mappedNewestLikes = newestLikes.map((likes) => {
                return {
                    addedAt: likes.addedAt,
                    userId: likes.userId,
                    login: likes.userLogin,
                };
            });
            let myStatus = "None";
            if (!user) {
                myStatus = "None";
            }
            else {
                const myStatusFromDb = yield reactions_schema_1.ReactionsModel.findOne({ parentId: post.id, userId: user.userId }, { _id: 0 }).lean();
                if (myStatusFromDb) {
                    myStatus = myStatusFromDb.status;
                }
            }
            return {
                id: post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: likes,
                    dislikesCount: dislikes,
                    myStatus: myStatus,
                    newestLikes: mappedNewestLikes,
                },
            };
            // post.extendedLikesInfo.likesCount = likes;
            // post.extendedLikesInfo.dislikesCount = dislikes;
            // post.extendedLikesInfo.myStatus = myStatus;
            // post.extendedLikesInfo.newestLikes = mappedNewestLikes;
            // return post;
        });
    }
};
PostsQueryRepository = __decorate([
    (0, inversify_1.injectable)()
], PostsQueryRepository);
exports.PostsQueryRepository = PostsQueryRepository;
