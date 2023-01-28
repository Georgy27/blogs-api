"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.GetUserIdFromAccessToken = exports.JwtAuthMiddleware = void 0;
const users_db_query_repository_1 = require("../../repositories/users-db-query-repository");
const jwt_service_1 = require("../../application/jwt-service");
const inversify_1 = require("inversify");
let JwtAuthMiddleware = class JwtAuthMiddleware {
    constructor(usersQueryRepository, jwtService) {
        this.usersQueryRepository = usersQueryRepository;
        this.jwtService = jwtService;
    }
    use(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const auth = req.headers.authorization;
            if (!auth)
                return res.sendStatus(401);
            const authType = auth.split(" ")[0];
            const token = auth.split(" ")[1];
            if (authType !== "Bearer")
                return res.sendStatus(401);
            const userId = yield this.jwtService.getUserIdByAccessToken(token);
            if (!userId)
                return res.sendStatus(401);
            req.user = yield this.usersQueryRepository.findUserById(userId);
            return next();
        });
    }
};
JwtAuthMiddleware = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(users_db_query_repository_1.UsersQueryRepository)),
    __param(1, (0, inversify_1.inject)(jwt_service_1.JwtService)),
    __metadata("design:paramtypes", [users_db_query_repository_1.UsersQueryRepository,
        jwt_service_1.JwtService])
], JwtAuthMiddleware);
exports.JwtAuthMiddleware = JwtAuthMiddleware;
let GetUserIdFromAccessToken = class GetUserIdFromAccessToken {
    constructor(usersQueryRepository, jwtService) {
        this.usersQueryRepository = usersQueryRepository;
        this.jwtService = jwtService;
    }
    use(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const auth = req.headers.authorization;
            if (!auth) {
                req.user = null;
                return next();
            }
            const token = auth.split(" ")[1];
            const userId = yield this.jwtService.getUserIdByAccessToken(token);
            if (!userId) {
                req.user = null;
                return next();
            }
            req.user = yield this.usersQueryRepository.findUserById(userId);
            return next();
        });
    }
};
GetUserIdFromAccessToken = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(users_db_query_repository_1.UsersQueryRepository)),
    __param(1, (0, inversify_1.inject)(jwt_service_1.JwtService)),
    __metadata("design:paramtypes", [users_db_query_repository_1.UsersQueryRepository,
        jwt_service_1.JwtService])
], GetUserIdFromAccessToken);
exports.GetUserIdFromAccessToken = GetUserIdFromAccessToken;
