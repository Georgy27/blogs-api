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
exports.AuthService = void 0;
const crypto_1 = require("crypto");
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_service_1 = require("./users-service");
const jwt_service_1 = require("../application/jwt-service");
const sessions_db_repository_1 = require("../repositories/sessions-db-repository");
const users_db_query_repository_1 = require("../repositories/users-db-query-repository");
const emails_manager_1 = require("../managers/emails-manager");
const inversify_1 = require("inversify");
let AuthService = class AuthService {
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
};
AuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(users_service_1.UsersService)),
    __param(1, (0, inversify_1.inject)(jwt_service_1.JwtService)),
    __param(2, (0, inversify_1.inject)(sessions_db_repository_1.SessionRepository)),
    __param(3, (0, inversify_1.inject)(users_db_query_repository_1.UsersQueryRepository)),
    __param(4, (0, inversify_1.inject)(emails_manager_1.EmailsManager)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_service_1.JwtService,
        sessions_db_repository_1.SessionRepository,
        users_db_query_repository_1.UsersQueryRepository,
        emails_manager_1.EmailsManager])
], AuthService);
exports.AuthService = AuthService;
