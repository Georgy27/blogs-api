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
exports.usersService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
const users_db_repository_1 = require("../repositories/users-db-repository");
const add_1 = __importDefault(require("date-fns/add"));
const emails_manager_1 = require("../managers/emails-manager");
exports.usersService = {
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
                emailConfirmation: {
                    confirmationCode: (0, crypto_1.randomUUID)(),
                    expirationDate: (0, add_1.default)(new Date(), {
                        minutes: 1,
                    }).toISOString(),
                    isConfirmed: false,
                },
            };
            const userResult = yield users_db_repository_1.usersRepository.createUser(newUser);
            try {
                yield emails_manager_1.emailsManager.sendEmailConformationMessage(userResult);
            }
            catch (error) {
                console.log(error);
                yield users_db_repository_1.usersRepository.deleteUser(userResult.id);
                return null;
            }
            return userResult;
        });
    },
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
                emailConfirmation: {
                    confirmationCode: (0, crypto_1.randomUUID)(),
                    expirationDate: (0, add_1.default)(new Date(), {
                        minutes: 1,
                    }).toISOString(),
                    isConfirmed: true,
                },
            };
            return users_db_repository_1.usersRepository.createUserByAdmin(newUser);
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_db_repository_1.usersRepository.deleteUser(id);
        });
    },
    checkCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_db_repository_1.usersRepository.findByLoginOrEmail(loginOrEmail);
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
    },
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(password, salt);
            return hash;
        });
    },
};
