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
exports.UsersService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
const add_1 = __importDefault(require("date-fns/add"));
const users_db_repository_1 = require("../repositories/users-db-repository");
const users_db_query_repository_1 = require("../repositories/users-db-query-repository");
const emails_manager_1 = require("../managers/emails-manager");
const inversify_1 = require("inversify");
let UsersService = class UsersService {
    constructor(usersRepository, usersQueryRepository, emailsManager) {
        this.usersRepository = usersRepository;
        this.usersQueryRepository = usersQueryRepository;
        this.emailsManager = emailsManager;
    }
    createUser(login, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(password, passwordSalt);
            const newUser = {
                id: (0, crypto_1.randomUUID)(),
                accountData: {
                    login,
                    email,
                    passwordHash,
                    createdAt: new Date().toISOString(),
                },
                passwordRecovery: {
                    recoveryCode: null,
                    expirationDate: null,
                },
                emailConfirmation: {
                    confirmationCode: (0, crypto_1.randomUUID)(),
                    expirationDate: (0, add_1.default)(new Date(), {
                        minutes: 1,
                    }).toISOString(),
                    isConfirmed: false,
                },
            };
            const userResult = yield this.usersRepository.createUser(newUser);
            try {
                yield this.emailsManager.sendEmailConformationMessage(userResult);
            }
            catch (error) {
                console.log(error);
                // await usersRepository.deleteUser(userResult.id);
                return null;
            }
            return userResult;
        });
    }
    createUserByAdmin(login, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(password, passwordSalt);
            const newUser = {
                id: (0, crypto_1.randomUUID)(),
                accountData: {
                    login,
                    email,
                    passwordHash,
                    createdAt: new Date().toISOString(),
                },
                passwordRecovery: {
                    recoveryCode: null,
                    expirationDate: null,
                },
                emailConfirmation: {
                    confirmationCode: (0, crypto_1.randomUUID)(),
                    expirationDate: (0, add_1.default)(new Date(), {
                        minutes: 1,
                    }).toISOString(),
                    isConfirmed: true,
                },
            };
            console.log(newUser);
            return this.usersRepository.createUserByAdmin(newUser);
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.usersRepository.deleteUser(id);
        });
    }
    checkCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersQueryRepository.findByLoginOrEmail(loginOrEmail);
            if (!user)
                return false;
            const check = yield bcrypt_1.default.compare(password, user.accountData.passwordHash);
            if (check) {
                return user;
            }
            else {
                return false;
            }
        });
    }
    sendPasswordRecoveryCode(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordRecoveryInfo = {
                recoveryCode: (0, crypto_1.randomUUID)(),
                expirationDate: (0, add_1.default)(new Date(), {
                    minutes: 1,
                }).toISOString(),
            };
            return yield this.usersRepository.createPasswordRecoveryCode(id, passwordRecoveryInfo);
        });
    }
    clearConfirmationCode(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordRecoveryInfo = {
                recoveryCode: null,
                expirationDate: null,
            };
            return yield this.usersRepository.clearConfirmationCode(id, passwordRecoveryInfo);
        });
    }
    updateUserPasswordHash(id, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersRepository.updateUserPasswordHash(id, passwordHash);
        });
    }
    updateConfirmation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersRepository.updateConfirmation(id);
        });
    }
    updateConfirmationCode(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersRepository.updateConfirmationCode(id);
        });
    }
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(password, salt);
            return hash;
        });
    }
};
UsersService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(users_db_repository_1.UsersRepository)),
    __param(1, (0, inversify_1.inject)(users_db_query_repository_1.UsersQueryRepository)),
    __param(2, (0, inversify_1.inject)(emails_manager_1.EmailsManager)),
    __metadata("design:paramtypes", [users_db_repository_1.UsersRepository,
        users_db_query_repository_1.UsersQueryRepository,
        emails_manager_1.EmailsManager])
], UsersService);
exports.UsersService = UsersService;
