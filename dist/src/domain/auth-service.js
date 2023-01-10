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
exports.authService = void 0;
const users_db_query_repository_1 = require("../repositories/users-db-query-repository");
const users_service_1 = require("./users-service");
const emails_manager_1 = require("../managers/emails-manager");
const crypto_1 = require("crypto");
const jwt_service_1 = require("../application/jwt-service");
const sessions_db_repository_1 = require("../repositories/sessions-db-repository");
exports.authService = {
    login(loginOrEmail, password, ip, deviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_service_1.usersService.checkCredentials(loginOrEmail, password);
            if (!user) {
                return null;
            }
            const deviceId = (0, crypto_1.randomUUID)();
            const tokens = yield jwt_service_1.jwtService.createJWT(user.id, deviceId);
            const issuedAt = yield jwt_service_1.jwtService.getIssuedAtByRefreshToken(tokens.refreshToken);
            yield jwt_service_1.jwtService.saveTokenToDB(ip, deviceName, issuedAt, deviceId, user.id);
            return tokens;
        });
    },
    refreshToken(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = yield jwt_service_1.jwtService.createJWT(userId, deviceId);
            const issuedAt = yield jwt_service_1.jwtService.getIssuedAtByRefreshToken(tokens.refreshToken);
            const updateLastActiveDate = yield sessions_db_repository_1.sessionRepository.updateLastActiveDate(deviceId, issuedAt);
            return tokens;
        });
    },
    confirmEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_db_query_repository_1.usersQueryRepository.findUserByConfirmationCode(code);
            if (!user)
                return false;
            const updatedConfirmation = yield users_service_1.usersService.updateConfirmation(user.id);
            return updatedConfirmation;
        });
    },
    resendEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_db_query_repository_1.usersQueryRepository.findByLoginOrEmail(email);
            if (!user)
                return false;
            const updatedConfirmationCode = yield users_service_1.usersService.updateConfirmationCode(user.id);
            if (!updatedConfirmationCode)
                return false;
            try {
                yield emails_manager_1.emailsManager.sendEmailConformationMessage(updatedConfirmationCode);
            }
            catch (error) {
                console.log(error);
                // await usersRepository.deleteUser(user.id);
                return null;
            }
            return true;
        });
    },
};
