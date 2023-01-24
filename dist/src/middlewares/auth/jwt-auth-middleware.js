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
exports.JwtAuthMiddleware = void 0;
class JwtAuthMiddleware {
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
}
exports.JwtAuthMiddleware = JwtAuthMiddleware;
