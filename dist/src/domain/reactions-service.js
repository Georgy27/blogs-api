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
exports.ReactionsService = void 0;
const crypto_1 = require("crypto");
class ReactionsService {
    constructor(reactionsRepository) {
        this.reactionsRepository = reactionsRepository;
    }
    // async updateReaction(comment: CommentsDBModel) {
    updateReaction(parentType, parentId, userId, userLogin, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const newReaction = {
                id: (0, crypto_1.randomUUID)(),
                parentType: parentType,
                parentId,
                status,
                addedAt: new Date().toISOString(),
                userId,
                userLogin,
            };
            return this.reactionsRepository.updateReaction(newReaction);
        });
    }
}
exports.ReactionsService = ReactionsService;
