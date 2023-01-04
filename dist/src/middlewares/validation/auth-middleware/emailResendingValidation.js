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
exports.emailResendingValidation = void 0;
const express_validator_1 = require("express-validator");
const users_db_query_repository_1 = require("../../../repositories/users-db-query-repository");
exports.emailResendingValidation = (0, express_validator_1.body)("email")
    .isEmail()
    .custom((email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_db_query_repository_1.usersQueryRepository.findByLoginOrEmail(email);
    if (!user) {
        throw new Error("user doesn't exist");
    }
    if (user.emailConfirmation.isConfirmed) {
        throw new Error("user email already confirmed");
    }
    return true;
}));
