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
exports.tokenRepository = void 0;
const db_1 = require("./db");
exports.tokenRepository = {
    saveRefreshToken(userId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.userTokenCollection.updateOne({ userId }, { $set: { refreshToken } }, {
                    upsert: true,
                });
                return true;
            }
            catch (error) {
                return false;
            }
        });
    },
    findTokenByUserId(userId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.userTokenCollection.findOne({ userId, refreshToken });
        });
    },
    deleteRefreshToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedToken = yield db_1.userTokenCollection.deleteOne({ userId });
            return deletedToken.deletedCount === 1;
        });
    },
};
