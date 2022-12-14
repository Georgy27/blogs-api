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
exports.commentsRepository = void 0;
const db_1 = require("./db");
exports.commentsRepository = {
    createComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.commentsCollection.insertOne(Object.assign({}, comment));
            return {
                id: comment.id,
                content: comment.content,
                userId: comment.userId,
                userLogin: comment.userLogin,
                createdAt: comment.createdAt,
            };
        });
    },
    // async createCommentFake(comment: CommentsDBModel): Promise<CommViewModel> {
    //   await commentsCollection.insertOne({ ...comment });
    //   return new CommViewModel(
    //     comment.id,
    //     comment.content,
    //     comment.userId,
    //     comment.userLogin,
    //     comment.createdAt
    //   );
    // },
    updateComment(content, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.commentsCollection.updateOne({ id: id }, {
                $set: { content },
            });
            return result.matchedCount === 1;
        });
    },
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.commentsCollection.deleteOne({ id });
            return result.deletedCount === 1;
        });
    },
    clearComments() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.commentsCollection.deleteMany({});
        });
    },
};
