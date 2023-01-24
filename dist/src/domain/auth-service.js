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
exports.AuthService = void 0;
const crypto_1 = require("crypto");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthService {
    constructor(usersService, jwtService, sessionRepository, usersQueryRepository, emailsManager) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.sessionRepository = sessionRepository;
        this.usersQueryRepository = usersQueryRepository;
        this.emailsManager = emailsManager;
    }
    login(loginOrEmail, password, ip, deviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersService.checkCredentials(loginOrEmail, password);
            if (!user) {
                return null;
            }
            const deviceId = (0, crypto_1.randomUUID)();
            const tokens = yield this.jwtService.createJWT(user.id, deviceId);
            const issuedAt = yield this.jwtService.getIssuedAtByRefreshToken(tokens.refreshToken);
            yield this.jwtService.saveTokenToDB(ip, deviceName, issuedAt, deviceId, user.id);
            return tokens;
        });
    }
    refreshToken(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = yield this.jwtService.createJWT(userId, deviceId);
            const issuedAt = yield this.jwtService.getIssuedAtByRefreshToken(tokens.refreshToken);
            const updateLastActiveDate = yield this.sessionRepository.updateLastActiveDate(deviceId, issuedAt);
            return tokens;
        });
    }
    passwordRecovery(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersQueryRepository.findByLoginOrEmail(email);
            if (!user)
                return null;
            const updatedUser = yield this.usersService.sendPasswordRecoveryCode(user.id);
            if (!updatedUser)
                return null;
            try {
                yield this.emailsManager.sendPasswordRecoveryCode(updatedUser);
                return true;
            }
            catch (error) {
                return null;
            }
        });
    }
    newPassword(password, code) {
        return __awaiter(this, void 0, void 0, function* () {
            // generate new password hash
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this.usersService._generateHash(password, passwordSalt);
            // find the user
            const user = yield this.usersQueryRepository.findUserByPasswordConfirmationCode(code);
            if (!user)
                return null;
            // update user password hash in db
            const updatedPasswordHash = yield this.usersService.updateUserPasswordHash(user.id, passwordHash);
            if (!updatedPasswordHash)
                return null;
            // set recoveryCode and expirationCode to null
            return yield this.usersService.clearConfirmationCode(user.id);
        });
    }
    confirmEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersQueryRepository.findUserByEmailConfirmationCode(code);
            if (!user)
                return false;
            const updatedConfirmation = yield this.usersService.updateConfirmation(user.id);
            return updatedConfirmation;
        });
    }
    resendEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersQueryRepository.findByLoginOrEmail(email);
            if (!user)
                return false;
            const updatedConfirmationCode = yield this.usersService.updateConfirmationCode(user.id);
            if (!updatedConfirmationCode)
                return false;
            try {
                yield this.emailsManager.sendEmailConformationMessage(updatedConfirmationCode);
            }
            catch (error) {
                console.log(error);
                // await usersRepository.deleteUser(user.id);
                return null;
            }
            return true;
        });
    }
}
exports.AuthService = AuthService;
