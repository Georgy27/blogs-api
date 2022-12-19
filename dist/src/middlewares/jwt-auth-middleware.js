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
exports.jwtAuthMiddleware = void 0;
const jwt_service_1 = require("../application/jwt-service");
const users_db_query_repository_1 = require("../repositories/users-db-query-repository");
const jwtAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = req.headers.authorization;
    if (!auth)
        return res.sendStatus(401);
    const authType = auth.split(" ")[0];
    const token = auth.split(" ")[1];
    if (authType !== "Bearer")
        return res.sendStatus(401);
    const userId = yield jwt_service_1.jwtService.getUserIdByToken(token);
    if (!userId)
        return res.sendStatus(401);
    req.user = yield users_db_query_repository_1.usersQueryRepository.findUserById(userId);
    return next();
});
exports.jwtAuthMiddleware = jwtAuthMiddleware;
