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
exports.CommentsRepository = void 0;
const comment_schema_1 = require("../models/comments-model/comment-schema");
const inversify_1 = require("inversify");
let CommentsRepository = class CommentsRepository {
    createComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = yield comment_schema_1.CommentsModel.create(Object.assign({}, comment));
            return {
                id: newComment.id,
                content: newComment.content,
                commentatorInfo: {
                    userId: newComment.commentatorInfo.userId,
                    userLogin: newComment.commentatorInfo.userLogin,
                },
                createdAt: newComment.createdAt,
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: "None",
                },
            };
        });
    }
    updateComment(content, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield comment_schema_1.CommentsModel.updateOne({ id: id }, { content });
            return result.matchedCount === 1;
        });
    }
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield comment_schema_1.CommentsModel.deleteOne({ id });
            return result.deletedCount === 1;
        });
    }
    clearComments() {
        return __awaiter(this, void 0, void 0, function* () {
            yield comment_schema_1.CommentsModel.deleteMany({});
        });
    }
};
CommentsRepository = __decorate([
    (0, inversify_1.injectable)()
], CommentsRepository);
exports.CommentsRepository = CommentsRepository;
