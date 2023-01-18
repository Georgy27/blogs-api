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
exports.confirmRecoveryCode = void 0;
const express_validator_1 = require("express-validator");
const users_db_query_repository_1 = require("../../../repositories/users-db-query-repository");
exports.confirmRecoveryCode = (0, express_validator_1.body)("recoveryCode")
    .isString()
    .notEmpty()
    .custom((code) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_db_query_repository_1.usersQueryRepository.findUserByPasswordConfirmationCode(code);
    if (!user) {
        throw new Error("user doesn't exist");
    }
    if (user.passwordRecovery.recoveryCode !== code) {
        throw new Error("user code does not match");
    }
    if (user.passwordRecovery.expirationDate < new Date().toISOString()) {
        throw new Error("user code has expired");
    }
    return true;
}));
