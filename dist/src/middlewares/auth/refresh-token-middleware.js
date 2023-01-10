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
exports.refreshTokenMiddleware = void 0;
const jwt_service_1 = require("../../application/jwt-service");
const users_db_query_repository_1 = require("../../repositories/users-db-query-repository");
const sessions_db_repository_1 = require("../../repositories/sessions-db-repository");
const refreshTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
        return res.sendStatus(401);
    const jwtPayload = yield jwt_service_1.jwtService.getJWTPayloadByRefreshToken(refreshToken);
    if (!jwtPayload.userId)
        return res.sendStatus(401);
    // check if user exists
    const user = yield users_db_query_repository_1.usersQueryRepository.findUserById(jwtPayload.userId);
    if (!user)
        return res.sendStatus(401);
    const issuedAt = yield jwt_service_1.jwtService.getIssuedAtByRefreshToken(refreshToken);
    // check if the token expired
    const lastActiveDate = yield sessions_db_repository_1.sessionRepository.findLastActiveDate(user.userId, issuedAt);
    if (!lastActiveDate)
        return res.sendStatus(401);
    req.user = user;
    req.jwtPayload = jwtPayload;
    return next();
});
exports.refreshTokenMiddleware = refreshTokenMiddleware;
