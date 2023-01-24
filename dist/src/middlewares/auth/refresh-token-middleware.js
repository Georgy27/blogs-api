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
exports.RefreshTokenMiddleware = void 0;
class RefreshTokenMiddleware {
    constructor(jwtService, usersQueryRepository, sessionRepository) {
        this.jwtService = jwtService;
        this.usersQueryRepository = usersQueryRepository;
        this.sessionRepository = sessionRepository;
    }
    use(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = req.cookies;
            if (!refreshToken)
                return res.sendStatus(401);
            const jwtPayload = yield this.jwtService.getJWTPayloadByRefreshToken(refreshToken);
            if (!jwtPayload.userId)
                return res.sendStatus(401);
            // check if user exists
            const user = yield this.usersQueryRepository.findUserById(jwtPayload.userId);
            if (!user)
                return res.sendStatus(401);
            const issuedAt = yield this.jwtService.getIssuedAtByRefreshToken(refreshToken);
            // check if the token expired
            const lastActiveDate = yield this.sessionRepository.findLastActiveDate(user.userId, issuedAt);
            if (!lastActiveDate)
                return res.sendStatus(401);
            req.user = user;
            req.jwtPayload = jwtPayload;
            return next();
        });
    }
}
exports.RefreshTokenMiddleware = RefreshTokenMiddleware;
