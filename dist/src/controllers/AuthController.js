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
exports.AuthController = void 0;
const auth_service_1 = require("../domain/auth-service");
const users_service_1 = require("../domain/users-service");
const sessions_db_repository_1 = require("../repositories/sessions-db-repository");
const inversify_1 = require("inversify");
let AuthController = class AuthController {
    constructor(authService, usersService, sessionRepository) {
        this.authService = authService;
        this.usersService = usersService;
        this.sessionRepository = sessionRepository;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { loginOrEmail, password } = req.body;
            const deviceName = req.headers["user-agent"];
            if (!deviceName)
                return res.sendStatus(401);
            const ip = req.ip;
            const tokens = yield this.authService.login(loginOrEmail, password, ip, deviceName);
            if (!tokens)
                return res.sendStatus(401);
            res.cookie("refreshToken", tokens.refreshToken, {
                maxAge: 20000,
                httpOnly: true,
                secure: true,
            });
            return res.status(200).send({ accessToken: tokens.accessToken });
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, password, email } = req.body;
            const newUser = yield this.usersService.createUser(login, password, email);
            if (!newUser)
                return res.sendStatus(400);
            return res.sendStatus(204);
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.userId;
            const deviceId = req.jwtPayload.deviceId;
            const tokens = yield this.authService.refreshToken(userId, deviceId);
            res.cookie("refreshToken", tokens.refreshToken, {
                maxAge: 20000,
                httpOnly: true,
                secure: true,
            });
            return res.status(200).send({ accessToken: tokens.accessToken });
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.userId;
            const deviceId = req.jwtPayload.deviceId;
            const removeToken = yield this.sessionRepository.deleteSessionByDeviceID(deviceId, userId);
            if (!removeToken)
                return res.sendStatus(401);
            return res.clearCookie("refreshToken").status(204).send({});
        });
    }
    registrationConfirmation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = req.body.code;
            const isConfirmedEmail = yield this.authService.confirmEmail(code);
            if (!isConfirmedEmail) {
                return res.sendStatus(400);
            }
            return res.sendStatus(204);
        });
    }
    registrationEmailResending(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userEmail = req.body.email;
            const result = yield this.authService.resendEmail(userEmail);
            // if email could not be send (can be 500 error)
            if (!result)
                return res.sendStatus(400);
            return res.sendStatus(204);
        });
    }
    passwordRecovery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userEmail = req.body.email;
            yield this.authService.passwordRecovery(userEmail);
            return res.sendStatus(204);
        });
    }
    newPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { newPassword, recoveryCode } = req.body;
            const result = yield this.authService.newPassword(newPassword, recoveryCode);
            if (!result)
                return res.sendStatus(400);
            return res.sendStatus(204);
        });
    }
    me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield req.user;
            return res.status(200).send(user);
        });
    }
};
AuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(auth_service_1.AuthService)),
    __param(1, (0, inversify_1.inject)(users_service_1.UsersService)),
    __param(2, (0, inversify_1.inject)(sessions_db_repository_1.SessionRepository)),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService,
        sessions_db_repository_1.SessionRepository])
], AuthController);
exports.AuthController = AuthController;
