"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.UsersRepository = void 0;
const crypto_1 = require("crypto");
const user_schema_1 = require("../models/users-model/user-schema");
const inversify_1 = require("inversify");
let UsersRepository = class UsersRepository {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_schema_1.UsersModel.create(Object.assign({}, user));
            return user;
        });
    }
    createUserByAdmin(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("before save");
                yield user_schema_1.UsersModel.create(Object.assign({}, user));
                console.log("after save");
                return {
                    id: user.id,
                    login: user.accountData.login,
                    email: user.accountData.email,
                    createdAt: user.accountData.createdAt,
                };
            }
            catch (e) {
                console.log(e);
                return {
                    id: user.id,
                    login: user.accountData.login,
                    email: user.accountData.email,
                    createdAt: user.accountData.createdAt,
                };
            }
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_schema_1.UsersModel.deleteOne({ id });
            return result.deletedCount === 1;
        });
    }
    updateConfirmation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield user_schema_1.UsersModel.updateOne({ id }, { "emailConfirmation.isConfirmed": true });
            return updatedUser.modifiedCount === 1;
        });
    }
    updateConfirmationCode(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield user_schema_1.UsersModel.findOneAndUpdate({ id }, {
                "emailConfirmation.confirmationCode": (0, crypto_1.randomUUID)(),
            }, { returnDocument: "after" }).lean();
            if (!updatedUser)
                return null;
            return updatedUser;
        });
    }
    updateUserPasswordHash(id, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUserHash = yield user_schema_1.UsersModel.updateOne({ id }, {
                "accountData.passwordHash": passwordHash,
            });
            return updatedUserHash.modifiedCount === 1;
        });
    }
    createPasswordRecoveryCode(id, passwordRecoveryInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = user_schema_1.UsersModel.findOneAndUpdate({ id }, {
                passwordRecovery: passwordRecoveryInfo,
            }, {
                returnDocument: "after",
            }).lean();
            if (!updatedUser)
                return null;
            return updatedUser;
        });
    }
    clearConfirmationCode(id, passwordRecoveryInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_schema_1.UsersModel.findOneAndUpdate({ id }, {
                passwordRecovery: passwordRecoveryInfo,
            }).lean();
        });
    }
    clearUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_schema_1.UsersModel.deleteMany({});
        });
    }
};
UsersRepository = __decorate([
    (0, inversify_1.injectable)()
], UsersRepository);
exports.UsersRepository = UsersRepository;
