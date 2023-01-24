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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const settings_1 = require("../settings");
class JwtService {
    constructor(sessionRepository) {
        this.sessionRepository = sessionRepository;
    }
    createJWT(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = jsonwebtoken_1.default.sign({ userId }, settings_1.settings.JWT_SECRET, {
                expiresIn: "10s",
            });
            const refreshToken = jsonwebtoken_1.default.sign({ deviceId, userId }, settings_1.settings.JWT_REFRESH_SECRET, {
                expiresIn: "20s",
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
}
exports.JwtService = JwtService;
