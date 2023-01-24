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
exports.UsersService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
const add_1 = __importDefault(require("date-fns/add"));
class UsersService {
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
}
exports.UsersService = UsersService;
