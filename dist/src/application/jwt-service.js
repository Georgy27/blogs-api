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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const settings_1 = require("../settings");
const sessions_db_repository_1 = require("../repositories/sessions-db-repository");
const inversify_1 = require("inversify");
let JwtService = class JwtService {
    constructor(sessionRepository) {
        this.sessionRepository = sessionRepository;
    }
    createJWT(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = jsonwebtoken_1.default.sign({ userId }, settings_1.settings.JWT_SECRET, {
                expiresIn: "1h",
            });
            const refreshToken = jsonwebtoken_1.default.sign({ deviceId, userId }, settings_1.settings.JWT_REFRESH_SECRET, {
                expiresIn: "24h",
            });
            return {
                accessToken,
                refreshToken,
            };
        });
    }
    getIssuedAtByRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshTokenDecoded = jsonwebtoken_1.default.decode(refreshToken);
            const issuedAt = new Date(refreshTokenDecoded.iat * 1000).toISOString();
            return issuedAt;
        });
    }
    saveTokenToDB(ip, deviceName, issuedAt, deviceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = {
                ip,
                deviceName,
                lastActiveDate: issuedAt,
                deviceId,
                userId,
            };
            yield this.sessionRepository.saveNewSession(tokenData);
            return tokenData;
        });
    }
    getUserIdByAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, settings_1.settings.JWT_SECRET);
                return result.userId;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getJWTPayloadByRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, settings_1.settings.JWT_REFRESH_SECRET);
                return result;
            }
            catch (error) {
                return null;
            }
        });
    }
};
JwtService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(sessions_db_repository_1.SessionRepository)),
    __metadata("design:paramtypes", [sessions_db_repository_1.SessionRepository])
], JwtService);
exports.JwtService = JwtService;
